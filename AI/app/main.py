"""
main application
"""
from fastapi import FastAPI
import uvicorn
import config
import app.routers as routers
import app.core.util as util

app = FastAPI(title="MyFairy AI API")
util.LogConfig(active_log_file=True, file_name="info.log",
               mode="a", string_cut_mode=False)


@app.get("/")
@util.logger
def hello():
    return {"hello": "world"}


app.include_router(routers.ask_router)  # ask router 추가
app.include_router(routers.gen_router)  # gen router 추가
app.include_router(routers.submit_router)  # submit router 추가

uvicorn.run(app, host=config.FAST_API_HOST,
            port=config.FAST_API_PORT)
