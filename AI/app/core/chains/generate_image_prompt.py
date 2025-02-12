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

from langchain_core.runnables import RunnableSequence, RunnablePassthrough
import re
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import PydanticOutputParser
from app.models.common import PromptSet

from langchain_openai import ChatOpenAI

llm = ChatOpenAI(temperature=0.1)

Parser = PydanticOutputParser(pydantic_object=PromptSet)

prompt = ChatPromptTemplate.from_messages([
    (
        "system",
        """
Role: act as a professional visual artist specializing in creating diffusion model prompts for enhancing fairy tale illustrations.

Context:
- Create diffusion prompts based on a fairy tale’s main scene and key narrative elements.
- The goal is to enhance the illustration style and detail to effectively reflect the fairy tale’s mood and content.

Input Values:
- Title: [Fairy Tale Title]
- Scene: [A detailed description of the scene in English, e.g., "a red-haired girl with a big smile standing next to a small red house with a triangular roof and a brown door. To her side is a cute, simple black-and-white dog with a rounded head and floppy ears. The background is filled with fluffy blue clouds in a bright sky."]

Instructions:
1. Analyze the overall atmosphere and style from the scene description.
2. Extract the key elements (characters, background, emotions) from the scene.
3. Compose a diffusion prompt in English that starts with "Generate a whimsical children's storybook illustration." and includes detailed descriptions and an artistic style.
4. Ensure the prompt is concise (within 200 characters) and covers the essential elements.
5. Use the following fixed negative prompt: "longbody, lowres, bad anatomy, bad hands, missing fingers, extra digit, fewer digits, cropped, worst quality, low quality".

Constraints:
- The prompt must be clear, concise, and under 200 characters.
{format_instructions}
"""
    ),
    ("human", """
Title: {title}
Scene
{scene}
"""),
])

chain = RunnableSequence(
    {
        "title": RunnablePassthrough(),
        "scene": RunnablePassthrough(),
        "format_instructions": lambda _: Parser.get_format_instructions()
    }
    | prompt
    | llm
    | Parser
)
