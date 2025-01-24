"""
Ask Controller
"""
from fastapi import APIRouter, UploadFile, status, HTTPException
import config
import app.core.audio as audio_service
import app.models.request as request_dto
import app.models.response as response_dto

router = APIRouter(prefix=f"{config.API_BASE_URL}/ask", tags=["ask"])

"""
@router.post("/transcript", response_model=response_dto.ApiResponse[response_dto.TranscriptResponseDto])
def transcript_audio(file: UploadFile):
    # 파일을 저장한 후 저장된 파일의 경로를 반환
    file_path = save_file(file.file.read(), "wb", file.filename)

    if audio_service.is_audio_length_ok(file_path):  # 음성의 길이가 최대 길이를 넘지 않는다면,
        # 음성을 텍스트로 변환하여 반환
        return response_dto.TranscriptResponseDto(text=audio_service.transcript_audio(file_path))
    else:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="음성의 길이가 너무 깁니다.")
"""
"""
todo
음성 단어 인식 요청 함수 작성

손글씨 단어 인식 요청 함수 작성
"""
