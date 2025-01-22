
from fastapi import FastAPI, status, HTTPException
from pydantic import BaseModel, Field
import uvicorn
from app.routers.audio import router as audio_router
from app.routers.llm import router as llm_router
app = FastAPI()


class RequestItem(BaseModel):
    id: int = Field(0, title="The ID of the item")
    name: str = Field(None, title="Name of the item", max_length=300)
    description: str = Field(
        None, title="Description of the item", max_length=300)


@app.post("/items", response_model=RequestItem)
def read_items(request_item: RequestItem):
    print(request_item)
    if request_item.id == 0:
        print("error")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="ID cannot be 0")
    return request_item


@app.get("/items/{id}/{name}/{description}")
def read_items(id: int, name: str, description: str):
    return {"id": id, "name": name, "description": description}


if __name__ == "__main__":
    app.include_router(audio_router)
    app.include_router(llm_router)
    uvicorn.run(app, host="localhost", port=8000)
