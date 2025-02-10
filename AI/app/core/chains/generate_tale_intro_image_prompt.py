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
        return result[0]


prompt = ChatPromptTemplate.from_messages([
    (
        "system",
        """
### **Role(역할지정):**  
Act as a professional prompt engineer specializing in diffusion model prompt generation for **story illustrations with dynamic and contextually accurate character actions**.  

### **Context(상황):**  
- The user provides a **story title** and **story introduction** as input.  
- Your goal is to generate a **detailed diffusion model prompt** that strictly adheres to the information given in the introduction **without adding or assuming additional details**.  
- The prompt must include:  
  - **A vivid scene description** based only on the provided introduction.  
  - **Specific character actions, poses, and expressions** aligned with the story introduction.  
  - **Background details** that enhance the setting but do not introduce new story elements.  
  - **Lighting and color mood** to match the atmosphere.  
  - **Negative prompts** to filter out unwanted elements.  

### **Input Values(입력값):**  
- **Story Title**: The title of the fairy tale or story.  
- **Story Introduction**: A brief introduction or the beginning of the story.  

### **Instructions(단계별 지시사항):**  
1. **Analyze the story introduction** and extract key elements **without making assumptions beyond the given text**.  
2. **Identify dynamic actions that fit within the given introduction** while keeping the scene engaging.  
3. **Describe characters’ poses, gestures, and facial expressions** to enhance storytelling.  
4. **Detail the background setting** while keeping it generic if the introduction does not specify it.  
5. **Ensure the output remains strictly within the provided information** and does not introduce story elements that appear later.  
6. **Generate a structured prompt** including both a **positive prompt** and a **negative prompt** to optimize AI-generated output.  

### **Constraints(제약사항):**  
- The output must be strictly based on the **provided introduction only**.  
- Do not infer or add story details beyond the given text.  
- The scene should be **dynamic**, avoiding static or passive poses.  
- The output should be in **English** for better AI model compatibility.  

### **Output Indicator(출력값 지정):**  
- **Output format**: Markdown  
- **Output fields**:  
  - **Prompt**: A detailed description including character actions, expressions, setting, and lighting.  
  - **Negative Prompt**: A list of elements to avoid.  
"""
    ),
    ("human", """
Title: 아기돼지 삼형제
Intro: 옛날옛날 아기돼지 삼형제가 살고있었어요. 아기돼지는 각자 다른 재료로 집을 지으려고 해요.
"""),
    ("ai",
     """
Prompt: A vibrant storybook illustration of the Three Little Pigs in a cheerful, sunny outdoor setting. The three piglets are preparing to build their homes, each engaged in a different action. The **first piglet holds a hammer in one hand and a wooden plank in the other**, looking excited. The **second piglet wears a yellow construction helmet and is measuring a piece of wood with a ruler**, appearing focused. The **third piglet, serious and thoughtful, is sitting on a rock, holding a blueprint and sketching house plans with a pencil**. The background is a **bright green meadow with scattered building materials**, under a clear blue sky with a few fluffy clouds. Sunlight casts a warm glow, emphasizing the whimsical and playful nature of the scene. The art style is **storybook watercolor**, with soft brushstrokes and rich, lively colors.  
Negative Prompt: dark or eerie atmosphere, futuristic elements, horror themes, hyper-realistic rendering, static and lifeless poses, modern clothing, distorted anatomy, overly complex details.
"""),
    ("human", """
Title: {title}
Intro: {intro}
"""),
])
