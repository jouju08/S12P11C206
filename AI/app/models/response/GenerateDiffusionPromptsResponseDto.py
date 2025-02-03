from pydantic import BaseModel, Field
from app.models.common.PromptSet import PromptSet


class GenerateDiffusionPromptsResponseDto(BaseModel):
    prompts: list[PromptSet] = Field(title="프롬프트들",
                                     description="생성된 프롬프트들")
