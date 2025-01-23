import redis
from config import REDIS_HOST, REDIS_PORT, REDIS_DATABASE

redis_conn = redis.Redis(host=REDIS_HOST, port=REDIS_PORT, db=REDIS_DATABASE)
