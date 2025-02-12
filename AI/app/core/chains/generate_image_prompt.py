from langchain_core.runnables import RunnablePassthrough
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from app.models.common import PromptSet

from langchain_openai import ChatOpenAI

llm = ChatOpenAI(temperature=0.1)

parser = StrOutputParser()

prompt = ChatPromptTemplate.from_messages([
    (
        "system",
        """
You are a pro visual artist for fairy tale diffusion prompts.
Given [Title] and scene details, extract key elements and craft an English prompt

Input Values:
- Title: [Fairy Tale Title]
- Scene: [A detailed description of the scene in English]

Instructions:
1. Analyze the overall atmosphere and style from the scene description.
2. Extract the key elements (characters, background, emotions) from the scene.
3. Ensure the prompt is concise (within 200 characters) and covers the essential elements.

Constraints:
- The prompt must be clear, concise, and under 200 characters.
"""
    ),
    ("human", """
Title: 빨간 머리와 마법의 집
Scene
옛날 어느 날, 빨간 머리 소녀 아리는 작은 빨간 집 앞에 서 있었어요. 그 집은 삼각형 지붕과 갈색 문이 있어 마치 마법의 문처럼 보였죠. 아리의 옆에는 귀여운 흑백 강아지 토토가 항상 함께하며, 둘은 매일 신비로운 모험을 즐겼어요. 하늘엔 솜사탕처럼 부드러운 파란 구름이 가득해, 모든 순간이 마법처럼 느껴졌답니다.
     """
     ),
    ("ai",
     """
Generate a whimsical children's storybook illustration. a red-haired girl with a big smile standing next to a small red house with a triangular roof and a brown door. To her side is a cute, simple black-and-white dog with a rounded head and floppy ears. The background is filled with fluffy blue clouds in a bright sky.
      """),
    ("human", """
Title: {title}
Scene
{scene}
"""),
])

chain = {
    "title": RunnablePassthrough(),
    "scene": RunnablePassthrough(),
} | prompt | llm | parser
