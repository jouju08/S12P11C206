
from pydantic import BaseModel, Field
from app.models.common.PromptSet import PromptSet
from fastapi import File


class GeneratePictureRequestDto(BaseModel):
    roomId: int = Field(title="방 번호")
    order: int = Field(title="순서")
    image: str = Field(title="이미지")
    promptSet: PromptSet = Field(title="페이지 정보")
