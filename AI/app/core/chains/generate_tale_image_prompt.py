"""
제목을 입력으로받아 이미지로 만들어야 하는 프롬프트를 생성하는 체인입니다.
"""

from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser

from langchain_openai import ChatOpenAI

llm = ChatOpenAI(temperature=0.4, model="gpt-4o-mini")

parser = StrOutputParser()
prompt = ChatPromptTemplate.from_messages([
    (
        "system",
        """
You are a pro visual artist for fairy tale diffusion prompts.
Given [Title], extract key elements and craft an English prompt

Input Values:
- Title: [Fairy Tale Title]

Instructions:
1. Analyze the overall atmosphere and style from the scene description.
2. Extract the key elements (characters, background, emotions) from the Title.
3. Ensure the prompt is concise (within 200 characters) and covers the essential elements.

Constraints:
- The prompt must be clear, concise, and under 200 characters.
"""
    ),
    ("human", """
Title: 아기돼지 삼형제
"""),
    ("ai",
     """
Three little pig brothers, each with a unique outfit, stand proudly in front of their houses made of straw, sticks, and bricks. The mischievous big bad wolf lurks nearby, preparing to blow down the weaker houses. The scene is set in a vibrant countryside with rolling green hills, colorful flowers, and a bright blue sky. Rendered in a charming storybook illustration style with soft pastel colors and warm, inviting textures, capturing the playful and whimsical atmosphere of the classic fairy tale.
"""),
    ("human", """
Title: {title}
"""),
])

chain = prompt | llm | parser
