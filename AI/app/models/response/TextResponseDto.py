from pydantic import BaseModel, Field


class TextResponseDto(BaseModel):
    text: str = Field(title="텍스트", description="텍스트 결과입니다.")
