from pydantic import BaseModel, Field


class PageInfo(BaseModel):
    extractedSentence: str = Field(title="추출된 문장")
    fullText: str = Field(title="전체 텍스트")
