"""
Ask Controller
"""
from fastapi import APIRouter, UploadFile, Form, File
import config
import app.core.util as util
import app.core.audio as audio_service
import app.core.picture as picture_service
import app.models.response as response_dto
import app.models.response.Status as Status

router = APIRouter(prefix=f"{config.API_BASE_URL}/ask", tags=["ask"])


@router. get("/can-draw-picture", description="그림을 그릴 수 있는지 확인하는 API", response_model=response_dto.ApiResponse[bool])
@util.logger
def can_draw_picture():
    """
    그림을 그릴 수 있는지 확인하는 API
    """
    return response_dto.ApiResponse(
        status=Status.SUCCESS,
        message="OK",
        data=picture_service.can_draw_picture()
    )


@router.post("/voice-to-word", description="음성에서 단어를 텍스트로 변환하는 API", response_model=response_dto.ApiResponse[response_dto.TextResponseDto])
@util.logger
def transcript_audio(file: UploadFile):
    """
    음성에서 단어를 텍스트로 변환하는 API
    """
    # 파일을 바이트로 읽어들임
    file_bytes = file.file.read()
    file_path = util.save_file(file_bytes, "wb", file.filename)
    return response_dto.ApiResponse(
        status=Status.SUCCESS,
        message="OK",
        data=audio_service.transcript_audio(file_path))


@router.post("/handwrite-to-word", description="손글씨를 텍스트로 변환하는 API", response_model=response_dto.ApiResponse[response_dto.TextResponseDto])
@util.logger
def handwrite_to_word(file: UploadFile):
    """
    손글씨를 텍스트로 변환하는 API
    """
    if picture_service.is_image_suffix_ok(file):
        file_bytes = file.file.read()
        response = picture_service.handwrite_to_word(file_bytes)

        if response is None:
            return response_dto.ApiResponse(
                status=Status.BAD_REQUEST,
                message="BAD REQUEST",
                data=response_dto.TextResponseDto(text="손글씨를 인식할 수 없습니다.")
            )

        return response_dto.ApiResponse(
            status=Status.SUCCESS,
            message="OK",
            data=response
        )

    else:
        return response_dto.ApiResponse(
            status=Status.BAD_REQUEST,
            message="지원하지 않는 파일 형식입니다. 지원하는 형식은 jpg, jpeg, png, pdf, tif, tiff 입니다.",
            data=None
        )
