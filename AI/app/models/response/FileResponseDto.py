from pydantic import BaseModel, Field


class FileResponseDto(BaseModel):
    file: bytes = Field(title="파일 경로", description="파일 경로")
