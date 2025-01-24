from pydantic import BaseModel, Field


class GenerateDiffusionPromptsRequestDto(BaseModel):
    title: str = Field(
        title="동화의 제목", description="동화의 제목을 입력해주세요.", example="신데렐라")
    scenes: list[str] = Field(title="동화의 각 페이지별 내용",
                              description="동화의 각 페이지별 내용을 입력해주세요.")
