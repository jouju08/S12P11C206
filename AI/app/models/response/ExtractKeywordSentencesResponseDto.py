from pydantic import BaseModel, Field


class ExtractKeywordSentencesResponseDto(BaseModel):
    sentences: list[str] = Field(title="문장들",
                                 description="추출된 문장들")
