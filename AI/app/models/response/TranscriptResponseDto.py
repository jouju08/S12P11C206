from pydantic import BaseModel, Field


class TranscriptResponseDto(BaseModel):
    text: str = Field(title="텍스트", description="오디오에서 추출된 텍스트")
