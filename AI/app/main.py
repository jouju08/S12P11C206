"""
main application
"""
from fastapi import FastAPI
import uvicorn
import config
import app.routers as routers

app = FastAPI(title="MyFairy AI API")


@app.get("/")
def hello():
    return {"hello": "world"}


app.include_router(routers.ask_router)  # ask router 추가
app.include_router(routers.gen_router)  # gen router 추가
app.include_router(routers.submit_router)  # submit router 추가

uvicorn.run(app, host=config.FAST_API_HOST,
            port=config.FAST_API_PORT)
