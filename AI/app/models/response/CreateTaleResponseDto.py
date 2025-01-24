from pydantic import BaseModel, Field


class CreateTaleResponseDto(BaseModel):
    pages: list[str] = Field(
        title="각 페이지별 내용", description="동화의 각 페이지별 내용입니다.")
