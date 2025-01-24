import config
from db.s3.connection import s3_conn


def put(local_file_name, upload_file_name):
    try:
        s3_conn.upload_file(
            local_file_name, config.AWS_S3_BUCKET, upload_file_name)
        return True
    except Exception as e:
        return False


def get(local_file_name, download_file_name):
    try:
        s3_conn.download_file(
            config.AWS_S3_BUCKET, download_file_name, local_file_name)
        return True
    except Exception as e:
        return False


def delete(file_name):
    try:
        s3_conn.delete_object(
            Bucket=config.AWS_S3_BUCKET, Key=file_name)
        return True
    except Exception as e:
        return False
