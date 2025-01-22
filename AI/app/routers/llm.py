from app.config.init_config import BASE_URL
from fastapi import APIRouter, UploadFile
from app.core.llm import extract_keyword_sentences, create_tale, generate_diffusion_prompts
import app.models.request as requestDTO
import app.models.response as responseDTO
router = APIRouter(prefix=f"{BASE_URL}/llm", tags=["llm"])


@router.get("/keyword-sentences/{title}", response_model=responseDTO.ExtractKeywordSentencesResponseDto)
def post_extract_keyword_sentences(title):
    return extract_keyword_sentences(title)


@router.post("/create-tale", response_model=responseDTO.CreateTaleResponseDto)
def post_create_tale(create_tale_request: requestDTO.CreateTaleRequestDto):
    return create_tale(create_tale_request)


@router.post("/generate-diffusion-prompts", response_model=responseDTO.GenerateDiffusionPromptsResponseDto)
def post_generate_diffusion_prompts(generate_diffusion_prompts_request: requestDTO.GenerateDiffusionPromptsRequestDto):
    return generate_diffusion_prompts(generate_diffusion_prompts_request)
