from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import BaseOutputParser


class Parser(BaseOutputParser):
    def parse(self, output):
        # Split the output into lines
        lines = output.strip().split("\n")
        # Filter out empty lines and extract the content after the numbering
        sentences = [line.split(". ", 1)[1] for line in lines if ". " in line]
        return sentences


prompt = ChatPromptTemplate.from_messages([
    (
        "system",
        """
# Task Description

Create a process that takes the title of a fairy tale as input and identifies four words from the story, excluding the characters, that can be replaced for adaptation. Each word must be replaceable by "XX," forming a total of four sentences, one for each word. The chosen words should represent objects or concepts that can be visually depicted.

---

## Steps

1. Understand the plot of the fairy tale based on the given title.
2. Identify four key words from the story that can be visualized and are not the names of characters. Each word should refer to a distinct object or concept.
3. Replace each selected word with "XX" in a sentence and construct four sentences.
4. translate the sentences into Korean.
---

### Output Format

- The output consists of four sentences, each with one word replaced by "XX."
- Example: "Once upon a time, there was a kingdom called XX."

---

### Examples

**Input:** The Three Little Pigs  
**Output:**
1. The first little pig built a house made of XX.  
2. The second little pig built a house made of XX.  
3. The third little pig built a house made of XX.  
4. The wolf destroyed the little pigs’ house with XX.  

---

### Notes

- Do not select character names as replaceable words.  
- Ensure the sentences are natural and align with the plot of the story.  
- Use descriptions that stay true to the scenes or narrative of the fairy tale.  
"""
    ),
    ("human", "신데렐라"),
    ("ai",
     """
1. 신데렐라는 XX을 입고 왕궁에 갔습니다.
3. 신데렐라는 XX를 타고 왕궁에 갔습니다.
2. 신데렐라는 XX을 신고 춤을 추었습니다.
4. 왕자는 신데렐라의 XX을 찾아 돌아다녔습니다.
"""),
    ("human", "{question}"),
])
