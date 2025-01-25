from pydantic import BaseModel, Field
from .PageInfo import PageInfo


class GenerateTaleResponseDto(BaseModel):
    pages: list[PageInfo] = Field(title="페이지 정보")
