from pydantic import BaseModel, Field


class CreateTaleRequestDto(BaseModel):
    title: str = Field(default="피리부는 사나이", title="동화의 제목",
                       description="동화의 제목을 입력해주세요.")
    introduction: str = Field(default="옛날 옛날 어느 마을에 피리부는 사나이가 살았습니다.",
                              title="동화의 도입부", description="동화의 도입부를 입력해주세요.")
    sentences: list[str] = Field(default=[
        "피리부는사나이는 XX을 연주하여 마을을 구했습니다.",
        "피리부는사나이는 XX을 이용해 마을 사람들을 이끌었습니다.",
        "피리부는사나이는 XX을 이용하여 악당을 물리쳤습니다.",
        "마을 사람들은 피리부는사나이의 XX에 감사했습니다."
    ], title="필수문장", description="동화의 필수문장을 입력해주세요.")
