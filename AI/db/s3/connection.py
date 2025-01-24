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


s3_conn = s3_connection()
