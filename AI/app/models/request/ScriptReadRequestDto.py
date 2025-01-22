from pydantic import BaseModel, Field


class ScriptReadRequestDto(BaseModel):
    script: str = Field(title="스크립트", description="tts로 받을 스크립트")
