from pydantic import BaseModel, Field


class GenerateSentenceResponseDto(BaseModel):
    introduction: str = Field(title="도입부")
    sentences: list[str] = Field(title="키워드 문장들")
