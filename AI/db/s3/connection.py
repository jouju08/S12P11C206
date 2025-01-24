import boto3
import config


def s3_connection():
    try:
        s3 = boto3.client(
            service_name="s3",
            region_name=config.AWS_S3_REGION,
            aws_access_key_id=config.AWS_S3_ACCESS,
            aws_secret_access_key=config.AWS_S3_SECRET,
        )
    except Exception as e:
        print(e)
    else:
        print("s3 bucket connected!")
        return s3


class S3Connection:
    def __init__(self):
        self.s3_conn = s3_connection()

    def put(self, local_file_name, upload_file_name):
        try:
            self.s3_conn.upload_file(
                local_file_name, config.AWS_S3_BUCKET, upload_file_name)
            return True
        except Exception as e:
            return False

    def get(self, local_file_name, download_file_name):
        try:
            self.s3_conn.download_file(
                config.AWS_S3_BUCKET, download_file_name, local_file_name)
            return True
        except Exception as e:
            return False

    def delete(self, file_name):
        try:
            self.s3_conn.delete_object(
                Bucket=config.AWS_S3_BUCKET, Key=file_name)
            return True
        except Exception as e:
            return False


s3_conn = S3Connection()
