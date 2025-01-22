"""
LLM Controller
"""
from fastapi import APIRouter
import app.config as config
import app.core.llm as llm_service
import app.models.request as request_dto
import app.models.response as response_dto

router = APIRouter(prefix=f"{config.BASE_URL}/llm", tags=["llm"])


@router.get("/keyword-sentences/{title}", response_model=response_dto.ExtractKeywordSentencesResponseDto)
def extract_keyword_sentences(title):
    return llm_service.extract_keyword_sentences(title)


@router.post("/create-tale", response_model=response_dto.CreateTaleResponseDto)
def create_tale(create_tale_request: request_dto.CreateTaleRequestDto):
    return llm_service.create_tale(create_tale_request)


@router.post("/generate-diffusion-prompts", response_model=response_dto.GenerateDiffusionPromptsResponseDto)
def generate_diffusion_prompts(generate_diffusion_prompts_request: request_dto.GenerateDiffusionPromptsRequestDto):
    return llm_service.generate_diffusion_prompts(generate_diffusion_prompts_request)
