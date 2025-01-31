"""
Gen Controller
"""
from fastapi import APIRouter, UploadFile, BackgroundTasks
import config
import app.core.llm as llm_service
import app.core.audio as audio_service
import app.core.picture as picture_service
import app.models.request as request_dto
import app.models.response as response_dto
import app.models.response.Status as Status

router = APIRouter(prefix=f"{config.API_BASE_URL}/gen", tags=["gen"])


@router.post("/tale", description="동화를 생성하는 API", response_model=response_dto.ApiResponse[response_dto.GenerateTaleResponseDto])
def generate_tale(taleRequestDto: request_dto.GenerateTaleRequestDto):
    """
    동화를 생성하는 API
    """
    result = response_dto.ApiResponse(
        status=Status.SUCCESS,
        message="OK",
        data=llm_service.generate_tale(taleRequestDto)
    )
    BackgroundTasks.add_task(llm_service.generate_diffusion_prompts, title= taleRequestDto.title, pages= result.data.pages)
    return result


@router.post("/script-read", description="스크립트를 읽어주는 API")
def script_read(scriptReadRequestDto: request_dto.ScriptReadRequestDto):
    """
    스크립트를 읽어주는 API
    """

    return audio_service.script_read(scriptReadRequestDto)

@router.post("/picture", description="손그림에서 그림을 생성하는 API", response_model=response_dto.ApiResponse[response_dto.URLResponseDto])
def generate_img2img(pictureRequestDto: request_dto.GeneratePictureRequestDto, picture: UploadFile):
    """
    손그림에서 그림을 생성하는 API
    """
    if not picture_service.is_image_suffix_ok(picture):
        raise ValueError("지원하지 않는 이미지 확장자입니다.")
    file_bytes = picture.file.read()
    return response_dto.ApiResponse(
        status=Status.SUCCESS,
        message="OK",
        data = picture_service.generate_img2img(pictureRequestDto, file_bytes)
    )
