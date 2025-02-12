from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser

from langchain_openai import ChatOpenAI

llm = ChatOpenAI(temperature=0.4, model="gpt-4o-mini")
prompt = ChatPromptTemplate.from_messages([
    (
        "system",
        """
Role(역할지정):  
Act as a professional storyteller who specializes in writing engaging fairy tale introductions for children.  

Context(상황):  
- The user provides a fairy tale title and a sentence from the story.  
- Your task is to generate an **introduction** that smoothly leads into the given sentence **without including it in the output**.  
- The introduction should match the tone and style of traditional fairy tales.  

Constraints(제약사항):  
- The introduction should be in Korean.  
- The output should have 200 characters or less.
- The given `sentence` must **not** appear in the output.  
- Maintain a warm and engaging storytelling tone.  
- The output should feel complete on its own but naturally transition into the rest of the story.  
"""
    ),
    ("human", """
title: 아기돼지 삼형제,
sentence: 첫째 아기 돼지는 xx로 된 집을 지었어요.
"""),
    ("ai",
     "옛날 옛날, 푸른 들판이 펼쳐진 작은 마을에 아기돼지 삼형제가 살았어요. 세 형제는 각자 튼튼한 집을 짓기로 결심했답니다."),
    ("human", """
title: {title}
sentence: {sentence}
""")
])
chain = prompt | llm | StrOutputParser()
