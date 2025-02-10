"""
Audio Service
"""
import base64
import time
from fastapi import Response
from openai import OpenAI
from pydub import AudioSegment
import config
import app.core.util as util
import app.core.chains as chains
import app.models.request as request_dto
import app.models.response as response_dto


def is_audio_length_ok(file):
    """
    audio 파일의 길이가 MAX_AUDIO_LENGTH 이하인지 확인하는 함수
    """
    audio = AudioSegment.from_file(file)
    return len(audio)//60//1000 < config.MAX_AUDIO_LENGTH


def transcript_audio(file):
    """
    audio 파일을 텍스트로 변환하는 함수
    audio -> text 변환
    """
    with open(file, "rb") as audio:
        client = OpenAI()
        transcription = client.audio.transcriptions.create(
            model="whisper-1",
            file=audio,
            language="ko"
        )
    util.delete_file(file)
    return response_dto.TextResponseDto(text=transcription.text)


def script_read(textRequestDto: request_dto.TextRequestDto):
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
                        "text": textRequestDto.text,
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
    # wav 파일로 변환하여 반환
    filename = f"{time.time_ns()}_script_read.wav"
    response_data = base64.b64decode(response.choices[0].message.audio.data)
    # multipart 데이터 생성

    return Response(
        content=response_data,
        media_type='application/octet-stream',
        headers={
            "Content-Disposition": f'attachment; filename="{filename}"'
        }
    )
