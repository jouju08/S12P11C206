"""
LLM Service
"""
from langchain_openai import ChatOpenAI

import app.core.chains as chains

import app.models.request as request_dto
import app.models.response as response_dto
from app.models.common import PromptSet, PageInfo


def extract_keyword_sentences(title: str):
    """
    제목을 입력받아 해당 동화의 주요 키워드를 담은 문장을 추출하는 함수
    """

    # 체인 생성
    chain = chains.extract_sentence_from_title_prompt | ChatOpenAI(
        temperature=0.7, model="gpt-4o") | chains.NumberdListParser()
    # 체인 실행
    response = chain.invoke({"question": title})

    return response_dto.ExtractKeywordSentencesResponseDto(sentences=response)


def write_tale(title, introduction, sentences):
    """
    제목, 소개, 문장들을 입력받아 동화를 생성하는 함수
    """

    # 체인 생성
    chain = chains.write_tale_prompt | ChatOpenAI(
        temperature=0.7, model="gpt-4o") | chains.NumberdListParser()

    # 체인 실행
    response = chain.invoke({
        "title": title,
        "introduction": introduction,
        "sentences": sentences
    })

    return response


def extract_sentence_from_tale(contents: list[str]):
    """
    동화의 각 페이지별 상세 내용을 입력받아 한 문장으로 요약하는 함수
    """

    # 체인 생성
    chain = chains.extract_sentence_from_tale_prompt | ChatOpenAI(
        temperature=0.1) | chains.NumberdListParser()

    # 체인 실행
    response = chain.invoke({
        "contents": contents
    })

    return response


def generate_tale(generate_tale_request: request_dto.GenerateTaleRequestDto):
    """
    제목, 소개, 문장들을 입력받아
    페이지별 내용과 요약문장을 출력하는 함수
    Controller에서 호출
    """
    contents = write_tale(generate_tale_request.title,
                          generate_tale_request.introduction,
                          generate_tale_request.sentences)
    sentences = extract_sentence_from_tale(contents)
    pages = []
    for i, sentence in enumerate(sentences):
        page = PageInfo(
            extractedSentence=sentence, fullText=contents[i])
        pages.append(page)

    return response_dto.GenerateTaleResponseDto(pages=pages)


def generate_diffusion_prompts(title: str, pages: list[PageInfo]):
    """
    제목과 각 페이지별 내용을 입력받아 diffusion모델에 들어갈 프롬프트를 생성하는 함수
    """

    # 체인 생성성
    chain = chains.generate_image_prompt | ChatOpenAI(
        temperature=0.1, model="gpt-3.5-turbo") | chains.GenerateImageOutputParser()
    scenes = []
    for page in pages:
        scenes.append(page.fullText)

    # 체인 실행
    response = chain.invoke({
        "title": title,
        "scenes": scenes
    })

    # response를 DTO로 변환
    prompts = []
    for item in response:
        prompt = PromptSet(
            prompt=item["Prompt"], negativePrompt=item["Negative Prompt"])
        prompts.append(prompt)
    result = response_dto.GenerateDiffusionPromptsResponseDto(prompts=prompts)
    print(prompts)
    """
    todo:
    prompts를 springboot로 전달
    """
