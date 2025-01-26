"""
Gen Controller
"""
from fastapi import APIRouter
from fastapi.responses import StreamingResponse
import config
import app.core.llm as llm_service
import app.core.audio as audio_service
import app.models.request as request_dto
import app.models.response as response_dto
import app.models.response.Status as Status

router = APIRouter(prefix=f"{config.API_BASE_URL}/gen", tags=["gen"])


@router.post("/tale", description="동화를 생성하는 API", response_model=response_dto.ApiResponse[response_dto.GenerateTaleResponseDto])
def generate_tale(taleRequestDto: request_dto.GenerateTaleRequestDto):
    """
    동화를 생성하는 API
    """
    return response_dto.ApiResponse(
        status=Status.SUCCESS,
        message="OK",
        data=llm_service.generate_tale(taleRequestDto))


@router.post("/script-read", description="스크립트를 읽어주는 API")
def script_read(scriptReadRequestDto: request_dto.ScriptReadRequestDto):
    """
    스크립트를 읽어주는 API
    """

    return audio_service.script_read(scriptReadRequestDto)


"""
todo
그림 ai 생성 api를 만들어야 함
"""
