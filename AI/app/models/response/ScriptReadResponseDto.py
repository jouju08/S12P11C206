from pydantic import BaseModel, Field


class ScriptReadResponseDto(BaseModel):
    file: str = Field(title="파일 경로", description="파일 경로")
