"""
동화에 들어갈 주요 내용을 기반으로 디퓨전 모델에서 사용할 prompt와 negative prompt를 생성

# Example
---
## Input
Title: 아기돼지 삼형제
Scene
['늑대가 첫째 돼지의 깃털 집을 후~ 하고 불어 날려버렸어요. 첫째 돼지는 놀라 도망쳐 둘째 돼지의 나뭇가지 집으로 갔습니다.','둘째 돼지는 숲에서 깃털로 집을 짓기 시작했어요. 집은 무지개처럼 빛났지만 형제들은 약하다고 걱정했습니다.','셋째 돼지는 초콜릿 블록으로 튼튼한 집을 짓고, 사탕으로 장식했어요. 형제들은 모두 초콜릿 집의 튼튼함에 감탄했습니다.','늑대는 첫째, 둘째 돼지의 집을 날려버렸지만 초콜릿 집은 부수지 못했습니다. 형제들은 초콜릿 집에서 안전하게 살았습니다.']

## Output
1.
Prompt: A dramatic moment where a large wolf is blowing down a delicate feather house in a lush forest. The feathers scatter like snow in the wind, while the frightened pig runs away toward another house in the distance. The mood is tense but still whimsical and lighthearted.
Negative Prompt: No dark tones, harsh lighting, menacing or violent imagery, overly realistic textures, or stormy weather.
2.
Prompt: A cheerful pig proudly building a colorful feather house in a sunny forest clearing. The feathers shimmer like a rainbow, creating a magical and delicate look. The pig appears confident and happy, surrounded by skeptical siblings.
Negative Prompt: No dark colors, messy backgrounds, or overly realistic or industrial designs.
3.
Prompt: A cozy, inviting house made of glossy chocolate blocks, decorated with colorful candies. The pig is happily putting on the final touches while the warm sunlight enhances the chocolate's shine. Nearby, the other pigs look on with admiration.
Negative Prompt: No dull colors, chaotic details, or cold and lifeless settings.
4.
Prompt: A tense but whimsical scene of the wolf trying to blow down or hammer the chocolate house, which stands firm and unyielding. The three pigs peek out of the safe house, looking relieved and united. The sunny forest adds warmth to the triumphant mood.
Negative Prompt: No overly scary wolf imagery, dark or gloomy atmosphere, or lack of natural forest elements.

"""

import re
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import BaseOutputParser


class Parser(BaseOutputParser):
    def parse(self, income_string):
        # Extract prompts and negative prompts using regex
        pattern = re.compile(
            r'Prompt: (.*?)\nNegative Prompt: (.*?)(?=\n\d+\.|$)', re.DOTALL)
        matches = pattern.findall(income_string)

        # Create a list of dictionaries
        result = [{"Prompt": "((Fairy tale style)), (cute), (high Quality),"+match[0].strip(), "Negative Prompt": "((No letters)),"+match[1].strip()}
                  for match in matches]
        return result


prompt = ChatPromptTemplate.from_messages([
    (
        "system",
        """
Role(역할지정):
act as a professional visual artist specializing in creating diffusion model prompts for enhancing fairy tale illustrations.

Context(상황):
- 동화의 삽화 메인 문장과 동화에 들어갈 주요 내용을 기반으로 디퓨전 모델에서 사용할 prompt와 negative prompt를 작성하려고 합니다.
- 목표는 동화의 내용과 분위기를 잘 반영하여, 메인 삽화의 스타일과 디테일을 효과적으로 증강시키는 것입니다.

Input Values(입력값):
- Title: 동화의 제목
- Scene: 동화의 삽화에 들어갈 내용을 담은 리스트

Instructions(단계별 지시사항):
1. 동화의 메인 문장을 분석하여 전반적인 분위기(예: 밝고 따뜻한, 신비로운, 어두운 등)를 파악합니다.
2. 동화의 주요 내용을 기반으로 삽화의 중심 요소(예: 캐릭터, 배경, 감정 등)를 추출합니다.
3. 메인 문장의 스타일과 동화의 요소에 맞게 디퓨전 prompt를 작성합니다.
4. prompt는 구체적이고 상세한 묘사와 적합한 예술적 스타일을 포함합니다(예: 수채화 스타일, 디즈니풍, 3D 아트 등).
5. negative prompt에는 불필요하거나 의도하지 않은 결과물을 방지하기 위한 요소를 포함합니다(예: 흐릿함, 왜곡, 과도한 세부 묘사 등).

Constraints(제약사항):
- 프롬프트는 명확하고 간결하게 작성합니다.
- prompt는 최대 200자 이내로 유지하며 핵심 요소를 포함합니다.

Output Indicator(출력값 지정):
- Output format: Plain Text
- Output fields: list of fields
  field1: Prompt
  field2: Negative Prompt
"""
    ),
    ("human", """
Title: 아기돼지 삼형제
Scene
['늑대가 첫째 돼지의 깃털 집을 후~ 하고 불어 날려버렸어요. 첫째 돼지는 놀라 도망쳐 둘째 돼지의 나뭇가지 집으로 갔습니다.','둘째 돼지는 숲에서 깃털로 집을 짓기 시작했어요. 집은 무지개처럼 빛났지만 형제들은 약하다고 걱정했습니다.','셋째 돼지는 초콜릿 블록으로 튼튼한 집을 짓고, 사탕으로 장식했어요. 형제들은 모두 초콜릿 집의 튼튼함에 감탄했습니다.','늑대는 첫째, 둘째 돼지의 집을 날려버렸지만 초콜릿 집은 부수지 못했습니다. 형제들은 초콜릿 집에서 안전하게 살았습니다.']
"""),
    ("ai",
     """
1.
Prompt: A dramatic moment where a large wolf is blowing down a delicate feather house in a lush forest. The feathers scatter like snow in the wind, while the frightened pig runs away toward another house in the distance. The mood is tense but still whimsical and lighthearted.
Negative Prompt: No dark tones, harsh lighting, menacing or violent imagery, overly realistic textures, or stormy weather.
2.
Prompt: A cheerful pig proudly building a colorful feather house in a sunny forest clearing. The feathers shimmer like a rainbow, creating a magical and delicate look. The pig appears confident and happy, surrounded by skeptical siblings.
Negative Prompt: No dark colors, messy backgrounds, or overly realistic or industrial designs.
3.
Prompt: A cozy, inviting house made of glossy chocolate blocks, decorated with colorful candies. The pig is happily putting on the final touches while the warm sunlight enhances the chocolate's shine. Nearby, the other pigs look on with admiration.
Negative Prompt: No dull colors, chaotic details, or cold and lifeless settings.
4.
Prompt: A tense but whimsical scene of the wolf trying to blow down or hammer the chocolate house, which stands firm and unyielding. The three pigs peek out of the safe house, looking relieved and united. The sunny forest adds warmth to the triumphant mood.
Negative Prompt: No overly scary wolf imagery, dark or gloomy atmosphere, or lack of natural forest elements.
"""),
    ("human", """
Title: {title}
Scene
{scenes}
"""),
])
