"""
Gen Controller
"""
from fastapi import APIRouter, UploadFile, BackgroundTasks, Form, File
import config
import app.core.llm as llm_service
import app.core.audio as audio_service
import app.core.picture as picture_service
import app.models.request as request_dto
import app.models.response as response_dto
import app.models.response.Status as Status

router = APIRouter(prefix=f"{config.API_BASE_URL}/gen", tags=["gen"])


@router.post("/tale", description="동화를 생성하는 API", response_model=response_dto.ApiResponse[response_dto.GenerateTaleResponseDto])
def generate_tale(taleRequestDto: request_dto.GenerateTaleRequestDto, background_tasks: BackgroundTasks):
    """
    동화를 생성하는 API
    """
    return response_dto.ApiResponse(
        status=Status.SUCCESS,
        message="OK",
        data=llm_service.generate_tale(taleRequestDto)
    )


@router.post("/script-read", description="스크립트를 읽어주는 API")
def script_read(scriptReadRequestDto: request_dto.ScriptReadRequestDto):
    """
    스크립트를 읽어주는 API
    """

    return audio_service.script_read(scriptReadRequestDto)


@router.post("/diffusion-prompts", description="이미지 프롬프트 생성", response_model=response_dto.ApiResponse[response_dto.GenerateDiffusionPromptsResponseDto])
def generate_diffusion_prompts(generateDiffusionPromptsRequestDto: request_dto.GenerateDiffusionPromptsRequestDto):
    """
    이미지 프롬프트 생성
    """
    return response_dto.ApiResponse(
        status=Status.SUCCESS,
        message="OK",
        data=llm_service.generate_diffusion_prompts(
            generateDiffusionPromptsRequestDto)
    )


@router.post("/picture", description="손그림에서 그림을 생성하는 API", response_model=response_dto.ApiResponse[str])
async def generate_img2img(roomId: int = Form(...),
                           order: int = Form(...),
                           prompt: str = Form(...),
                           negativePrompt: str = Form(...),
                           image: UploadFile = File(...)):
    """
    손그림에서 그림을 생성하는 API
    """

    return response_dto.ApiResponse(
        status=Status.SUCCESS,
        message="OK",
        data=picture_service.generate_img2img(
            roomId=roomId,
            order=order,
            prompt=prompt,
            negativePrompt=negativePrompt,
            image=image)
    )
