from sqlalchemy import Column, BigInteger, Text, DateTime, VARCHAR
from db.mysql.session import Base


class BaseTale(Base):
    __tablename__ = 'base_tale'

    id = Column(BigInteger, primary_key=True, index=True)
    created_at = Column(DateTime)
    updated_at = Column(DateTime)

    keyword1 = Column(VARCHAR(20))
    keyword2 = Column(VARCHAR(20))
    keyword3 = Column(VARCHAR(20))
    keyword4 = Column(VARCHAR(20))

    prompt = Column(Text)

    start_img = Column(VARCHAR(255))
    start_script = Column(Text)
    start_voice = Column(VARCHAR(255))

    title = Column(VARCHAR(50))
    title_img = Column(VARCHAR(255))
