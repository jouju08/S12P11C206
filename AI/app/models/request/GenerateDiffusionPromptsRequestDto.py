from pydantic import BaseModel, Field
from app.models.common import PageInfo


class GenerateDiffusionPromptsRequestDto(BaseModel):
    title: str = Field(..., title="제목")
    pages: list[PageInfo] = Field(..., title="장면들")
