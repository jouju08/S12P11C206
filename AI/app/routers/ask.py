"""
Ask Controller
"""
from fastapi import APIRouter, UploadFile
import config
import app.core.util as util
import app.core.audio as audio_service
import app.core.picture as picture_service
import app.models.response as response_dto
import app.models.response.Status as Status

router = APIRouter(prefix=f"{config.API_BASE_URL}/ask", tags=["ask"])


@router.post("/voice-to-word", description="음성에서 단어를 텍스트로 변환하는 API", response_model=response_dto.ApiResponse[response_dto.TextResponseDto])
def transcript_audio(file: UploadFile):
    """
    음성에서 단어를 텍스트로 변환하는 API
    """
    # 파일을 바이트로 읽어들임
    file_bytes = file.file.read()
    file_path = util.save_file(file_bytes, "wb", file.filename)
    if audio_service.is_audio_length_ok(file_path):  # 음성의 길이가 최대 길이를 넘지 않는다면,
        # 음성을 텍스트로 변환하여 반환
        return response_dto.ApiResponse(
            status=Status.SUCCESS,
            message="OK",
            data=audio_service.transcript_audio(file_path))
    else:
        util.delete_file(file_path)
        return response_dto.ApiResponse(
            status=Status.BAD_REQUEST,
            message="BAD REQUEST",
            detail="음성의 길이가 너무 깁니다."
        )


@router.post("/handwrite-to-word", description="손글씨를 텍스트로 변환하는 API", response_model=response_dto.ApiResponse[response_dto.TextResponseDto])
def handwrite_to_word(file: UploadFile):
    """
    손글씨를 텍스트로 변환하는 API
    """
    if picture_service.is_image_suffix_ok(file):
        file_bytes = file.file.read()
        return response_dto.ApiResponse(
            status=Status.SUCCESS,
            message="OK",
            data=picture_service.handwrite_to_word(file_bytes)
        )
    else:
        return response_dto.ApiResponse(
            status=Status.BAD_REQUEST,
            message="지원하지 않는 파일 형식입니다. 지원하는 형식은 jpg, jpeg, png, pdf, tif, tiff 입니다.",
            data=None
        )
