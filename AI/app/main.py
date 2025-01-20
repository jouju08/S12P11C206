
from fastapi import FastAPI
from pydantic import BaseModel, Field
import uvicorn
from app.routers.audio import router as audio_router
app = FastAPI()


class RequestItem(BaseModel):
    id: int = Field(0, title="The ID of the item")
    name: str = Field(None, title="Name of the item", max_length=300)
    description: str = Field(
        None, title="Description of the item", max_length=300)


@app.get("/items", response_model=RequestItem)
async def read_items():
    return {"id": 1, "name": "Foo", "description": "There comes my hero"}

if __name__ == "__main__":
    app.add_api_route(audio_router)
    uvicorn.run(app, host="localhost", port=8000)
