"""
동화의 내용을 입력받아 한 문장으로 요약하는 체인입니다.
"""

from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_openai import ChatOpenAI

llm = ChatOpenAI(temperature=0.4, model="gpt-4o-mini")

prompt = ChatPromptTemplate.from_messages([
    (
        "system",
        """
- 사용자가 동화의 각 페이지별 상세 내용을 입력합니다.
- 입력된 내용을 바탕으로 아이들이 쉽게 이해하고, 그림으로 표현하기 쉬운 한 문장으로 요약합니다.
- 이 문장은 직관적이고, 쉽게 장면을 상상할 수 있도록 작성되어야 합니다.

Instructions(단계별 지시사항):
1. 입력된 동화 페이지의 내용을 이해하고, 가장 중요한 장면을 파악합니다.
2. 아이들이 쉽게 이해할 수 있도록 짧고 간결한 문장을 만듭니다.
3. 장면을 그림으로 표현하기 쉽게, 구체적인 동작, 사물, 캐릭터를 포함하여 설명합니다.
4. 어렵거나 추상적인 단어를 피하고, 친숙한 어휘를 사용합니다.

Constraints(제약사항):
- 답변은 30자 내외의 짧은 문장으로 작성합니다.
- 어린이도 이해할 수 있는 쉬운 단어를 사용합니다.
- 동작과 감정을 포함하여 장면을 쉽게 떠올릴 수 있도록 합니다.
- answer in korean.
"""
    ),
    (
        "human",
        """
"구름은 가볍고 부드러우니 금방 집을 지을 수 있을 거야!" 그는 솜사탕 같은 구름을 모아 집을 완성했습니다. 하지만 늑대가 찾아와 "문을 열어라!"라고 외쳤을 때, 첫째 돼지는 두려움에 떨었습니다. 늑대가 숨을 크게 들이마시고 불어버리자, 구름으로 만든 집은 순식간에 사라져 버렸습니다. 첫째 돼지는 형제들에게 달려가며 도움을 청했습니다. "형들, 늑대가 내 집을 날려버렸어!"
"""
    ),
    (
        "ai",
        "구름으로 만든 집이 늑대의 숨결에 날아갔어요."
    ),
    (
        "human",
        """
{contents}
"""
    ),
])
parser = StrOutputParser()

chain = prompt | llm | parser
