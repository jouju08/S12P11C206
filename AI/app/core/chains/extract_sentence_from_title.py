"""
기존에 동화에서 주요 문장에서 4개의 단어를 추출

# Example
--- 
## Input 
신데렐라
## Output
1. 신데렐라는 XX을 입고 왕궁에 갔습니다.
2. 신데렐라는 XX를 타고 왕궁에 갔습니다.
3. 신데렐라는 XX을 신고 춤을 추었습니다.
4. 왕자는 신데렐라의 XX을 찾아 돌아다녔습니다.
"""

from langchain_core.prompts import ChatPromptTemplate
from app.core.chains import NumberdListParser

from langchain_openai import ChatOpenAI

llm = ChatOpenAI(temperature=0.4, model="gpt-4o-mini")

prompt = ChatPromptTemplate.from_messages([
    (
        "system",
        """
# Task Description

Create a process that takes the title of a fairy tale as input and identifies four words from the story, excluding the characters, that can be replaced for adaptation. 
Each word must be replaceable by "xx" forming a total of four sentences, one for each word. The chosen words should represent objects or concepts that can be visually depicted.

## Steps

1. Understand the plot of the fairy tale based on the given title.
2. Identify four key words from the story that can be visualized and are not the names of characters in order. Each word should refer to **a distinct object or concept**.
3. Replace each selected word with "xx" in a sentence and construct four sentences.
4. translate the sentences into Korean.

### Output Format

- The output consists of four sentences, each with one word replaced by "xx"
- Example: "Once upon a time, there was a kingdom called xx."

### Notes

- Do not select character names as replaceable words.  
- Ensure the sentences are natural and align with the plot of the story.  
- Use descriptions that stay true to the scenes or narrative of the fairy tale.  
"""
    ),
    ("human", "아기돼지 삼형제"),
    ("ai",
     """
1. 첫번째 아기돼지는 xx로 집을 지었습니다.  
2. 두번째 아기돼지는 xx로 집을 지었습니다.
3. 세번째 아기돼지는 xx로 집을 지었습니다.
4. 늑대는 xx로 집을 부수었습니다.
     """),
    ("human", "신데렐라"),
    ("ai",
     """
1. 신데렐라는 xx을 입고 왕궁에 갔습니다.
3. 신데렐라는 xx를 타고 왕궁에 갔습니다.
2. 신데렐라는 xx을 신고 춤을 추었습니다.
4. 왕자는 신데렐라의 xx을 찾아 돌아다녔습니다.
"""),
    ("human", "{question}"),
])

chain = prompt | llm | NumberdListParser()
