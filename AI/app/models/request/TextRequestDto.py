from pydantic import BaseModel, Field


class TextRequestDto(BaseModel):
    text: str = Field(title="text", description="텍스트 요청")
