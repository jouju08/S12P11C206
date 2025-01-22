from app.config.init_config import BASE_URL
import time
from fastapi import APIRouter, UploadFile, status, HTTPException
from app.core.audio import transcript_audio, is_audio_length_ok, script_read
import app.models.request as requestDTO
import app.models.response as responseDTO
from app.core.util import save_file

router = APIRouter(prefix=f"{BASE_URL}/audio", tags=["audio"])


@router.post("/transcript", response_model=responseDTO.TranscriptResponseDto)
def post_transcript_audio(file: UploadFile):
    file_path = save_file(file.file.read(), "wb", file.filename)

    if is_audio_length_ok(file_path):
        return responseDTO.TranscriptResponseDto(text=transcript_audio(file_path))
    else:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="음성의 길이가 너무 깁니다.")


@router.post("/script-read", response_model=responseDTO.ScriptReadResponseDto)
def post_script_read(scriptReadRequestDto: requestDTO.ScriptReadRequestDto):
    return script_read(scriptReadRequestDto)
