FROM python:3.10.8-slim

WORKDIR /app
COPY . /app
RUN pip install -r requirements.txt

ENV PYTHONUNBUFFERED=1
EXPOSE 8000
CMD ["gunicorn", "--bind", ":8000", "--workers", "3", "--log-level", "debug", "app:app"]
