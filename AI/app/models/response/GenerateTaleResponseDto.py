from pydantic import BaseModel, Field
import app.models.common as common_dto


class GenerateTaleResponseDto(BaseModel):
    pages: list[common_dto.PageInfo] = Field(title="페이지 정보")
