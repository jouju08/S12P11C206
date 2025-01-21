import app.config.init_config
from langchain_openai import ChatOpenAI
from app.core.chains.extract_sentence_from_title import prompt as extract_sentence_from_title_prompt, Parser as ExtractSentenceFromTitleOutputParser
from app.core.chains.create_tale import prompt as create_tale_prompt, Parser as CreateTaleOutputParser
from app.core.chains.generate_image_prompt import prompt as generate_image_prompt, Parser as GenerateImageOutputParser

llm = ChatOpenAI(temperature=0.1)


async def extract_keyword_sentences(title: str):
    chain = extract_sentence_from_title_prompt | llm | ExtractSentenceFromTitleOutputParser()
    return chain.invoke({"question": title})


async def create_tale(title: str, introduction: str, sentences):
    chain = create_tale_prompt | ChatOpenAI(
        temperature=0.1, model="gpt-4o") | CreateTaleOutputParser()

    return chain.invoke({
        "title": title,
        "introduction": introduction,
        "sentences": sentences
    })


async def generate_diffusion_prompts(title: str, scenes):
    chain = generate_image_prompt | llm | GenerateImageOutputParser()
    return chain.invoke({
        "title": title,
        "scenes": scenes
    })
