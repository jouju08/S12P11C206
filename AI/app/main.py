"""
main application
"""
from fastapi import FastAPI
import uvicorn
import config
import app.routers as routers

app = FastAPI(title="MyFairy AI API")

if __name__ == "__main__":
    app.include_router(routers.audio_router)  # audio router 추가
    app.include_router(routers.gen_router)  # llm router 추가
    uvicorn.run(app, host=config.FAST_API_HOST,
                port=config.FAST_API_PORT)
