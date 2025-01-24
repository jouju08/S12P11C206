"""
Audio Service
"""
import base64
from openai import OpenAI
from pydub import AudioSegment
import config
import app.core.chains as chains
import app.models.request as request_dto
import app.models.response as response_dto
from app.core.util import save_file


def is_audio_length_ok(file):
    """
    audio 파일의 길이가 MAX_AUDIO_LENGTH 이하인지 확인하는 함수
    """
    with open(file, "rb") as f:
        audio = AudioSegment.from_file(file)
    return len(audio)//60//1000 < config.MAX_AUDIO_LENGTH


def transcript_audio(file):
    """
    audio 파일을 텍스트로 변환하는 함수
    audio -> text 변환
    """
    client = OpenAI()
    with open(file, "rb") as audio_file:
        transcription = client.audio.transcriptions.create(
            model="whisper-1",
            file=audio_file
        )

    return transcription.text


def script_read(scriptReadRequestDto: request_dto.ScriptReadRequestDto):
    """
    스크립트를 읽어주는 함수
    text -> audio 변환
    """

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

    # response로 받은 파일을 저장
    audio = save_file(base64.b64decode(
        response.choices[0].message.audio.data), "wb", f"{scriptReadRequestDto.script[:20]}.wav")

    return response_dto.ScriptReadResponseDto(file=audio)
