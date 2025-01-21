from app.config.init_config import BASE_URL
from fastapi import APIRouter, UploadFile, status
from app.core.audio import transcribe_audio, is_audio_length_ok, script_read

router = APIRouter(prefix=f"{BASE_URL}/audio", tags=["audio"])


@router.post("/transcribe")
async def post_transcribe_audio(file: UploadFile):
    if is_audio_length_ok(file):
        transcription = transcribe_audio(await file.read())
        return transcription
    else:
        return {"error": "Audio length is too long"}, status.HTTP_400_BAD_REQUEST


@router.post("/script-read")
async def post_script_read(script: str):
    return await script_read(script)
