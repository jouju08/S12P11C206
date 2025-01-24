"""
LLM Service
"""
from langchain_openai import ChatOpenAI
import app.core.chains as chains
import app.models.request as request_dto
import app.models.response as response_dto


def extract_keyword_sentences(title: str):
    """
    제목을 입력받아 해당 동화의 주요 키워드를 담은 문장을 추출하는 함수
    """

    # 체인 생성
    chain = chains.extract_sentence_from_title_prompt | ChatOpenAI(
        temperature=0.7, model="gpt-4o") | chains.ExtractSentenceFromTitleOutputParser()
    # 체인 실행
    response = chain.invoke({"question": title})

    return response_dto.ExtractKeywordSentencesResponseDto(sentences=response)


def create_tale(create_tale_request: request_dto.CreateTaleRequestDto):
    """
    제목, 소개, 문장들을 입력받아 동화를 생성하는 함수
    """

    # 체인 생성
    chain = chains.create_tale_prompt | ChatOpenAI(
        temperature=0.7, model="gpt-4o") | chains.CreateTaleOutputParser()

    # 체인 실행
    response = chain.invoke({
        "title": create_tale_request.title,
        "introduction": create_tale_request.introduction,
        "sentences": create_tale_request.sentences
    })

    return response_dto.CreateTaleResponseDto(pages=response)


def generate_diffusion_prompts(generate_diffusion_prompts_request: request_dto.GenerateDiffusionPromptsRequestDto):
    """
    제목과 각 페이지별 내용을 입력받아 diffusion모델에 들어갈 프롬프트를 생성하는 함수
    """

    # 체인 생성성
    chain = chains.generate_image_prompt | ChatOpenAI(
        temperature=0.1, model="gpt-3.5-turbo") | chains.GenerateImageOutputParser()

    # 체인 실행
    response = chain.invoke({
        "title": generate_diffusion_prompts_request.title,
        "scenes": generate_diffusion_prompts_request.scenes
    })

    # response를 DTO로 변환
    prompts = []
    for item in response:
        prompt = response_dto.PromptSet(
            prompt=item["Prompt"], negative_prompt=item["Negative Prompt"])
        prompts.append(prompt)

    return response_dto.GenerateDiffusionPromptsResponseDto(prompts=prompts)
