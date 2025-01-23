# https://phsun102.tistory.com/63
import config
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base  # Base 생성


SQLALCHEMY_DATABASE_URL = config.MYSQL_URL
# 인자값으로 DB URL을 추가하면 DB Host에 DB 연결을 생성한다. 이 함수가 DB연결의 출발점이다.
engine = create_engine(SQLALCHEMY_DATABASE_URL)

"""
sessionmaker 
호출되었을 때, 세션을 생성해준다.

autocommit : api가 호출되어 DB의 내용이 변경된 경우, 자동으로 commit하며 변경할지에 대한 여부를 결정한다. 
  False로 지정한 경우에는, insert, update, delete 등으로 내용이 변경됬을 때, 수동적으로 commit을 진행해주어야 한다.

autoflush : 호출되면서 commit되지 않은 부분의 내역을 삭제할지의 여부를 정하는 부분이다.
bind : 어떤 엔진을 통해 DB연결을 할지 결정하는 부분이다. 
  MySQL, PostgreSQL 등 여러 SQL의 DB URL 중 어느 SQL제품으로 연결을 진행할지 선택하는 부분이다. 
  위의 부분에서는 engine변수가 하나밖에 선언되어있지 않지만, SQL을 여러 종류 쓰는 경우, 각 SQL에 맞게 해당 부분이 여러종류로 나뉠 수 있다.
"""
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# 상속된 DB모델 클래스들을 자동적으로 연결시켜주는 역할을 한다. 쉽게 말해, 테이블명이 일치하는 모델을 찾아 쿼리문을 실행시켜준다.
Base = declarative_base()
