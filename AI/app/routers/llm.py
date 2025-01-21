from app.config.init_config import BASE_URL
from fastapi import APIRouter, UploadFile
from app.core.llm import extract_keyword_sentences, create_tale, generate_diffusion_prompts

router = APIRouter(prefix=f"{BASE_URL}/llm", tags=["llm"])


@router.get("/keyword-sentences")
async def post_extract_keyword_sentences(title):
    return await extract_keyword_sentences(title)


@router.post("/create-tale")
async def post_create_tale(title, introduction, sentences):
    return await create_tale(title, introduction, sentences)


@router.post("/generate-diffusion-prompts")
async def post_generate_diffusion_prompts(title, scenes):
    return await generate_diffusion_prompts(title, scenes)
