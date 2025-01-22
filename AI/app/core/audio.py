from openai import OpenAI
from app.config.init_config import MAX_AUDIO_LENGTH
from pydub import AudioSegment
import app.core.chains as chains
from app.core.util import save_file
import app.models.request as requestDto
import app.models.response as responseDTO
import base64


def is_audio_length_ok(file):
    with open(file, "rb") as f:
        audio = AudioSegment.from_file(file)
    return len(audio)//60//1000 < MAX_AUDIO_LENGTH


def transcript_audio(file):
    client = OpenAI()
    with open(file, "rb") as audio_file:
        transcription = client.audio.transcriptions.create(
            model="whisper-1",
            file=audio_file
        )

    return transcription.text


def script_read(scriptReadRequestDto: requestDto.ScriptReadRequestDto):
    client = OpenAI()

    response = client.chat.completions.create(
        model="gpt-4o-audio-preview",
        messages=[
            {
                "role": "system",
                "content": [
                    {
                        "text": chains.read_tale_prompt,
                        "type": "text"
                    }
                ]
            },
            {
                "role": "user",
                "content": [
                    {
                        "text": scriptReadRequestDto.script,
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

    ret = save_file(base64.b64decode(
        response.choices[0].message.audio.data), "wb", f"{scriptReadRequestDto.script[:20]}.wav")
    return responseDTO.ScriptReadResponseDto(file=ret)
