
from pydantic import BaseModel, Field
from app.models.common.PromptSet import PromptSet

class GeneratePictureRequestDto(BaseModel):
  promptSet:PromptSet = Field(title="페이지 정보")
