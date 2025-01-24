import redis
from config import REDIS_HOST, REDIS_PORT, REDIS_DATABASE


class RedisConnection:
    def __init__(self):
        try:
            self.conn = redis.Redis(
                host=REDIS_HOST, port=REDIS_PORT, db=REDIS_DATABASE)
            print("Redis connection success")
        except redis.exceptions.ConnectionError:
            print("Redis connection error")

    def get(self, key):
        try:
            return self.conn.get(key)
        except redis.exceptions.ConnectionError:
            return None

    def set(self, key, value):
        try:
            self.conn.set(key, value)
        except redis.exceptions.ConnectionError:
            return None

    def delete(self, key):
        try:
            self.conn.delete(key)
        except redis.exceptions.ConnectionError:
            return None


redis_conn = RedisConnection()
