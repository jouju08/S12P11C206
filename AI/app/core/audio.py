from openai import OpenAI
from app.config import MAX_AUDIO_LENGTH
from pydub import AudioSegment


def is_audio_length_ok(file):
    audio = AudioSegment.from_file(file)
    return len(audio)/60/1000 < MAX_AUDIO_LENGTH


async def get_transcribe_audio(file):
    client = OpenAI()

    audio_file = open("/path/to/file/audio.mp3", "rb")
    transcription = client.audio.transcriptions.create(
        model="whisper-1",
        file=audio_file
    )

    return transcription
