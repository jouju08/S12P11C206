from pydantic import BaseModel, Field


class URLResponseDto(BaseModel):
    url: str = Field(title="url", description="url 결과입니다.")
