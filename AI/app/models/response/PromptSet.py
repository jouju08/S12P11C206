from pydantic import BaseModel, Field


class PromptSet(BaseModel):
    prompt: str = Field(title="긍정 프롬프트")
    negative_prompt: str = Field(title="부정 프롬프트")
