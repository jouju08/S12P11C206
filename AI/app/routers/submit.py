"""
Submit Controller
"""
from fastapi import APIRouter, UploadFile, Form, File, Request
import config
import app.core.picture as picture_service
import app.core.util as util
import app.models.response as response_dto
import app.models.response.Status as Status

router = APIRouter(prefix=f"{config.API_BASE_URL}/submit", tags=["submit"])


@router.post("/upgrade-handpicture")
@util.logger
def upgrade_handpicture_submit(roomId: str = Form(...),
                               order: str = Form(...),
                               file: UploadFile = File(...)):
    """
    그림 FastAPI 서버에서 손그림 이미지 생성이 완료됐을때, webhook으로 호출되는 API 
    """
    picture_service.upgrade_handpicture_submit(roomId, order, file)
    return response_dto.ApiResponse(
        status=Status.SUCCESS,
        message="OK",
        data=None
    )


@router.post("/gen-tale-image/{memberId}")
@util.logger
async def gen_tale_image_submit(request: Request, memberId: int):
    """
    novita 에서 동화 표지 이미지 생성이 완료됐을때, webhook으로 호출되는 API 
    """
    request = await request.body()
    request = util.parse_request(request)
    picture_service.return_novita_image(
        request, config.SPRING_GEN_TALE_IMG_WEBHOOK+f"/{memberId}")

    return response_dto.ApiResponse(
        status=Status.SUCCESS,
        message="OK",
        data=None
    )


@router.post("/gen-tale-intro-image/{memberId}")
@util.logger
async def gen_tale_intro_image_submit(request: Request, memberId: int):
    """
    novita 에서 서버에서 동화 도입부 이미지 생성이 완료됐을때, webhook으로 호출되는 API 
    """
    request = await request.body()
    request = util.parse_request(request)
    picture_service.return_novita_image(
        request, config.SPRING_GEN_TALE_INTRO_IMG_WEBHOOK+f"/{memberId}")
    return response_dto.ApiResponse(
        status=Status.SUCCESS,
        message="OK",
        data=None
    )
