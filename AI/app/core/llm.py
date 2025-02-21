"""
LLM Service
"""
import config
import app.core.chains as chains
import app.core.picture as picture_service
import app.models.request as request_dto
import app.models.response as response_dto
from app.models.common import PromptSet, PageInfo


def generate_sentences(title: str):
    """
    제목을 입력받아 동화의 주요 키워드를 담은 문장을 추출하고
    도입부를 생성하는 함수
    """
    sentences = extract_keyword_sentences(title)
    introduce = generate_introduction(title, sentences[0])
    return response_dto.GenerateSentencesResponseDto(
        introduction=introduce,
        sentences=sentences)


def generate_introduction(title: str, first_sentence: str):
    """
    제목과 첫 문장을 입력받아 도입부를 생성하는 함수
    """

    response = chains.generate_introduce.invoke(
        {"title": title, "sentence": first_sentence})
    return response


def extract_keyword_sentences(title: str):
    """
    제목을 입력받아 해당 동화의 주요 키워드를 담은 문장을 추출하는 함수
    """
    # 체인 실행
    response = chains.extract_sentence_from_title.invoke({"question": title})
    sentences = [sentence.replace("XX", "xx") for sentence in response]
    return sentences


def write_tale(title, introduction, sentences):
    """
    제목, 소개, 문장들을 입력받아 동화를 생성하는 함수
    """

    # 체인 실행
    response = chains.write_tale.invoke({
        "title": title,
        "introduction": introduction,
        "sentences": sentences
    })

    return response


async def extract_sentence_from_tale(contents: list[str]):
    """
    동화의 각 페이지별 상세 내용을 입력받아 한 문장으로 요약하는 함수
    """
    # 체인 실행
    # 병렬로 각 페이지별로 요약문장을 추출
    response = await chains.extract_sentence_from_tale.abatch(contents)

    return response


async def generate_tale(generate_tale_request: request_dto.GenerateTaleRequestDto):
    """
    제목, 소개, 문장들을 입력받아
    페이지별 내용과 요약문장을 출력하는 함수
    Controller에서 호출
    """
    contents = write_tale(generate_tale_request.title,
                          generate_tale_request.introduction,
                          generate_tale_request.sentences)
    print("contents: ", contents)

    sentences = await extract_sentence_from_tale(contents)
    print("sentences:", sentences)

    pages = []
    for i, sentence in enumerate(sentences):
        page = PageInfo(
            extractedSentence=sentence, fullText=contents[i])
        pages.append(page)
    return response_dto.GenerateTaleResponseDto(pages=pages)

positive_prompt_prefix = "Generate a whimsical children's storybook illustration. "
negative_prompt = "Signature, longbody, lowres, bad anatomy, bad hands, missing fingers, extra digit, fewer digits, cropped, worst quality, low quality"


async def generate_diffusion_prompts(generate_diffusion_prompts_request: request_dto.GenerateDiffusionPromptsRequestDto):
    """
    제목과 각 페이지별 내용을 입력받아 diffusion모델에 들어갈 프롬프트를 생성하는 함수
    """

    # 체인 생성성
    scenes = []
    for page in generate_diffusion_prompts_request.pages:
        scenes.append(page.fullText)

    # 체인 실행
    response = await chains.generate_image_prompt.abatch([{"title": generate_diffusion_prompts_request.title, "scene": scene} for scene in scenes])

    # response를 DTO로 변환
    prompts = []

    for item in response:
        prompt = PromptSet(
            prompt=positive_prompt_prefix + item, negativePrompt=negative_prompt)
        prompts.append(prompt)

    return response_dto.GenerateDiffusionPromptsResponseDto(prompts=prompts)


def generate_tale_image(title_image_request_dto: request_dto.GenerateTitleImageRequestDto):
    """
    제목을 입력받아 이미지 프롬프트를 생성하는 함수
    """

    response = chains.generate_tale_image_prompt.invoke(
        {"title": title_image_request_dto.title})

    prompt_set = PromptSet(prompt=positive_prompt_prefix + response,
                           negativePrompt=negative_prompt)
    print("prompt_set: ", prompt_set)
    picture_service.post_novita_api(
        prompt_set, config.GEN_TALE_IMG_WEBHOOK + f"/{title_image_request_dto.memberId}")


def generate_tale_intro_image(generate_intro_image_request: request_dto.GenerateIntroImageRequestDto):
    """
    제목과 도입부를 입력받아 이미지 프롬프트를 생성하는 함수
    """

    response = chains.generate_image_prompt.invoke({
        "title": generate_intro_image_request.title,
        "scene": generate_intro_image_request.intro
    })

    prompt_set = PromptSet(prompt=positive_prompt_prefix + response,
                           negativePrompt=negative_prompt)

    picture_service.post_novita_api(
        prompt_set, config.GEN_TALE_INTRO_IMG_WEBHOOK + f"/{generate_intro_image_request.memberId}")
