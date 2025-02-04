"""
main application
"""
from fastapi import FastAPI
import uvicorn
import config
import app.routers as routers

app = FastAPI(title="MyFairy AI API")

app.include_router(routers.ask_router)  # ask router 추가
app.include_router(routers.gen_router)  # gen router 추가

if __name__ == "__main__":
    uvicorn.run(app, host=config.FAST_API_HOST,
                port=config.FAST_API_PORT)
