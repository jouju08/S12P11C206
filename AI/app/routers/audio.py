from app.config import BASE_URL
from fastapi import APIRouter, UploadFile
from app.core.audio import get_transcribe_audio, is_audio_length_ok

router = APIRouter(prefix=f"{BASE_URL}/audio", tags=["audio"])


@router.post("/transcribe", response_class=str)
async def transcribe_audio(file: UploadFile):
    if is_audio_length_ok(file):
        transcription = get_transcribe_audio(await file.read())
        return transcription
