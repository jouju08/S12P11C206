"""
Ask Controller
"""
from fastapi import APIRouter, UploadFile, status, HTTPException
import config
import app.core.audio as audio_service
import app.models.response as response_dto
import app.models.response.Status as Status

router = APIRouter(prefix=f"{config.API_BASE_URL}/ask", tags=["ask"])


@router.post("/voice-to-word", response_model=response_dto.ApiResponse[response_dto.TranscriptResponseDto])
def transcript_audio(file: UploadFile):
    # 파일을 바이트로 읽어들임
    file_bytes = file.file.read()

    if audio_service.is_audio_length_ok(file_bytes):  # 음성의 길이가 최대 길이를 넘지 않는다면,
        # 음성을 텍스트로 변환하여 반환
        return response_dto.ApiResponse(status=Status.SUCCESS, message="OK", data=audio_service.transcript_audio(file_bytes))
    else:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="음성의 길이가 너무 깁니다.")

"""
todo

손글씨 단어 인식 요청 함수 작성
"""
