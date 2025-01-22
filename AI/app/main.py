"""
main application
"""
from fastapi import FastAPI
import uvicorn
import app.routers as routers

app = FastAPI(title="MyFairy AI API")

if __name__ == "__main__":
    app.include_router(routers.audio_router)  # audio router 추가
    app.include_router(routers.llm_router)  # llm router 추가
    uvicorn.run(app, host="localhost", port=8000)
