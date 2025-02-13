"""
Gen Controller
"""
from fastapi import APIRouter, UploadFile, Form, File, BackgroundTasks
import config
import app.core.llm as llm_service
import app.core.audio as audio_service
import app.core.picture as picture_service
import app.core.util as util
import app.models.request as request_dto
import app.models.response as response_dto
import app.models.response.Status as Status


router = APIRouter(prefix=f"{config.API_BASE_URL}/gen", tags=["gen"])


@router.post("/tale", description="동화를 생성하는 API", response_model=response_dto.ApiResponse[response_dto.GenerateTaleResponseDto])
@util.logger
async def generate_tale(taleRequestDto: request_dto.GenerateTaleRequestDto):
    """
    동화를 생성하는 API
    """
    return response_dto.ApiResponse(
        status=Status.SUCCESS,
        message="OK",
        data=await llm_service.generate_tale(taleRequestDto)
    )


@router.post("/script-read", description="스크립트를 읽어주는 API")
@util.logger
def script_read(textRequestDto: request_dto.TextRequestDto):
    """
    스크립트를 읽어주는 API
    """

    return audio_service.script_read(textRequestDto)


@router.post("/diffusion-prompts", description="이미지 프롬프트 생성", response_model=response_dto.ApiResponse[response_dto.GenerateDiffusionPromptsResponseDto])
@util.logger
async def generate_diffusion_prompts(generateDiffusionPromptsRequestDto: request_dto.GenerateDiffusionPromptsRequestDto):
    """
    이미지 프롬프트 생성
    """
    return response_dto.ApiResponse(
        status=Status.SUCCESS,
        message="OK",
        data=await llm_service.generate_diffusion_prompts(
            generateDiffusionPromptsRequestDto)
    )


@router.post("/upgrade-handpicture", description="손그림에서 그림을 생성하는 API", response_model=response_dto.ApiResponse[str])
@util.logger
async def upgrade_handpicture(roomId: int = Form(...),
                              order: int = Form(...),
                              prompt: str = Form(...),
                              negativePrompt: str = Form(...),
                              image: UploadFile = File(...)):
    """
    손그림에서 그림을 생성하는 API
    spring에서 손그림을 받아 이미지 생성 요청 전달
    """

    return response_dto.ApiResponse(
        status=Status.SUCCESS,
        message="OK",
        data=picture_service.upgrade_handpicture(
            roomId=roomId,
            order=order,
            prompt=prompt,
            negativePrompt=negativePrompt,
            image=image)
    )


@router.post("/tale-sentences", description="키워드 문장 생성", response_model=response_dto.ApiResponse[response_dto.GenerateSentencesResponseDto])
@util.logger
def generate_sentences(generateSentencesRequestDto: request_dto.TextRequestDto):
    """
    todo: 키워드 문장 생성
    """
    return response_dto.ApiResponse(
        status=Status.SUCCESS,
        message="OK",
        data=llm_service.generate_sentences(generateSentencesRequestDto.text)
    )


@router.post("/tale-image", response_model=response_dto.ApiResponse[str])
@util.logger
def generate_tale_image(title: request_dto.TextRequestDto, backgroundTask: BackgroundTasks):
    """
    todo: 동화 이미지 생성
    title을 받고 
    1. 이미지 생성할 수 있도록 diffusion prompt 생성
    2. 이미지 생성
    3. webhook으로 이미지 전송
    """
    backgroundTask.add_task(
        llm_service.generate_tale_image, title.text)

    return response_dto.ApiResponse(
        status=Status.SUCCESS,
        message="OK",
        data="OK"
    )


@router.post("/tale-intro-image", description="도입부 이미지 생성", response_model=response_dto.ApiResponse[str])
@util.logger
def generate_tale_intro_image(generateIntroImageRequestDto: request_dto.GenerateIntroImageRequestDto, backgroundTask: BackgroundTasks):
    """
    todo: 도입부 이미지 생성
    title, intro를 받고
    1. 이미지 생성할 수 있도록 diffusion prompt 생성
    2. 이미지 생성
    3. webhook으로 이미지 전송
    """
    backgroundTask.add_task(
        llm_service.generate_tale_intro_image, generateIntroImageRequestDto)

    return response_dto.ApiResponse(
        status=Status.SUCCESS,
        message="OK",
        data="OK"
    )
