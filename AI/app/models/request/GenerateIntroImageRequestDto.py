from pydantic import BaseModel, Field


class GenerateIntroImageRequestDto(BaseModel):
    memberId: int = Field(title="memberId", description="회원 아이디")
    title: str = Field(title="title", description="동화 제목")
    intro: str = Field(title="intro", description="도입부 텍스트")
