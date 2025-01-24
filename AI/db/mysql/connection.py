# https://phsun102.tistory.com/63
from db.mysql.session import SessionLocal


def mysql_conn():
    db = SessionLocal()  # 데이터베이스 세션 생성
    try:
        yield db  # 세션을 호출자에게 반환
    finally:
        db.close()  # 세션을 닫음


"""
사용법 예시
from fastapi import Depends, FastAPI
from sqlalchemy.orm import Session
from db.connection import get_db
from db.models import Item  # 예시 모델

app = FastAPI()

@app.post("/items/")
def create_item(item: Item, db: Session = Depends(mysql_conn)):
    mysql_conn.add(item)
    mysql_conn.commit()
    mysql_conn.refresh(item)
    return item
"""
