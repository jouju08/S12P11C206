from pydantic import BaseModel, Field


class GenerateTitleImageRequestDto(BaseModel):
    memberId: int = Field(title="memberId", description="회원 아이디")
    title: str = Field(title="title", description="동화 제목")
