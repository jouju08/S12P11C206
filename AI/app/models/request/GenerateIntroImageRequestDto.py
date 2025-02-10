from pydantic import BaseModel, Field


class GenerateIntroImageRequestDto(BaseModel):
    title: str = Field(title="title", description="동화 제목")
    intro: str = Field(title="intro", description="도입부 텍스트")
