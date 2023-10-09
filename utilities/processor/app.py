import os
from flask import Flask, request, jsonify
from datetime import datetime
import logging
import boto3
from botocore.exceptions import ClientError

from scripts.fidas_parser import processFile

# API start time
now = datetime.now()
api_start = now.ctime()

# S3 variables
S3_BUCKET = os.environ["S3_BUCKET"]  # needs to be already created on S3
S3_DIR = os.environ["S3_DIR"]
S3_BASE = "https://" + S3_BUCKET + ".s3." + os.environ["S3_REGION"] + ".amazonaws.com/"


# setup S3 session
session = boto3.Session(
    region_name=os.environ["S3_REGION"],
    aws_access_key_id=os.environ["S3_ACCESS_KEY_ID"],
    aws_secret_access_key=os.environ["S3_SECRET_ACCESS_KEY"],
)
s3 = session.resource("s3")


def uploadFile(buffer, outputpath):
    try:
        s3.Object(S3_BUCKET, outputpath).put(Body=buffer.getvalue())
    except ClientError as e:
        app.logger.error(e)
        return False
    return True


app = Flask(__name__)

if __name__ != "__main__":
    gunicorn_logger = logging.getLogger("gunicorn.error")
    app.logger.handlers = gunicorn_logger.handlers
    app.logger.setLevel(gunicorn_logger.level)


@app.route("/", methods=["GET"])
def api():
    return jsonify({"name": "Processing api", "version": 0.1, "startedAt": api_start})


@app.route("/fidas", methods=["POST"])
def fidasParser():
    request_data = request.get_json()
    location = request_data["location"]
    result, outputpath = processFile(location, S3_DIR)
    if uploadFile(result, outputpath):
        app.logger.info("Successfully saved to %s", outputpath)
        return jsonify(
            {
                "status": 200,
                "message": "Successfully uploaded processed file",
                "location": S3_BASE + outputpath,
            }
        )
    else:
        app.logger.error("Error saving file to %s", outputpath)
        return jsonify(
            {
                "status": 500,
                "message": "Error uploading processed file",
                "location": S3_BASE + outputpath,
            }
        )


if __name__ == "__main__":
    app.run(debug=True)
