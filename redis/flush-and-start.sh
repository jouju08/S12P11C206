#!/bin/sh

redis-cli flushall
exec redis-server /usr/local/etc/redis/redis.conf