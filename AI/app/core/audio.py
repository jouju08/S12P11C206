from openai import OpenAI
from app.config.init_config import MAX_AUDIO_LENGTH
from pydub import AudioSegment
from app.core.chains.read_tale import prompt as read_tale_prompt
from app.core.util import save_file
import base64


def is_audio_length_ok(file):
    audio = AudioSegment.from_file(file)
    return len(audio)/60/1000 < MAX_AUDIO_LENGTH


async def transcribe_audio(file):
    client = OpenAI()

    audio_file = open("/path/to/file/audio.mp3", "rb")
    transcription = client.audio.transcriptions.create(
        model="whisper-1",
        file=audio_file
    )

    return transcription


async def script_read(script: str):
    client = OpenAI()

    response = client.chat.completions.create(
        model="gpt-4o-audio-preview",
        messages=[
            {
                "role": "system",
                "content": [
                    {
                        "text": read_tale_prompt,
                        "type": "text"
                    }
                ]
            },
            {
                "role": "user",
                "content": [
                    {
                        "text": script,
                        "type": "text"
                    },
                ],
            },
        ],
        modalities=["text", "audio"],
        audio={
            "voice": "coral",
            "format": "wav"
        },
        temperature=1,
        max_completion_tokens=2048,
        top_p=1,
        frequency_penalty=0,
        presence_penalty=0
    )
    return save_file(base64.b64decode(response.choices[0].message.audio.data), "wb", f"{script[:20]}.wav")
