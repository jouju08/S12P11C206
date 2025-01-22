import app.config.init_config
from langchain_openai import ChatOpenAI
import app.core.chains as chains

import app.models.request as requestDTO
import app.models.response as responseDTO


def extract_keyword_sentences(title: str):
    chain = chains.extract_sentence_from_title_prompt | ChatOpenAI(
        temperature=0.7, model="gpt-4o") | chains.ExtractSentenceFromTitleOutputParser()
    response = chain.invoke({"question": title})
    return responseDTO.ExtractKeywordSentencesResponseDto(sentences=response)


def create_tale(create_tale_request: requestDTO.CreateTaleRequestDto):
    chain = chains.create_tale_prompt | ChatOpenAI(
        temperature=0.7, model="gpt-4o") | chains.CreateTaleOutputParser()
    response = chain.invoke({
        "title": create_tale_request.title,
        "introduction": create_tale_request.introduction,
        "sentences": create_tale_request.sentences
    })
    return responseDTO.CreateTaleResponseDto(pages=response)


def generate_diffusion_prompts(generate_diffusion_prompts_request: requestDTO.GenerateDiffusionPromptsRequestDto):
    chain = chains.generate_image_prompt | ChatOpenAI(
        temperature=0.1, model="gpt-3.5-turbo") | chains.GenerateImageOutputParser()
    response = chain.invoke({
        "title": generate_diffusion_prompts_request.title,
        "scenes": generate_diffusion_prompts_request.scenes
    })
    prompts = []
    for item in response:
        prompt = responseDTO.PromptSet(
            prompt=item["Prompt"], negative_prompt=item["Negative Prompt"])
        prompts.append(prompt)
    ret = responseDTO.GenerateDiffusionPromptsResponseDto(prompts=prompts)
    return ret
