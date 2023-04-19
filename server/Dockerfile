FROM python:3.9-slim as base
WORKDIR /app

RUN apt update && apt install -y --no-install-recommends gcc && \
    apt clean && rm -rf /var/lib/apt/lists/*

COPY ./server/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

FROM python:3.9-slim as prod

COPY --from=base /usr/local/lib/python3.9/site-packages /usr/local/lib/python3.9/site-packages

WORKDIR /app/server

COPY . ./server

EXPOSE 5000

ENV FLASK_APP=server/app.py

CMD ["python", "-m", "flask", "run", "--host=0.0.0.0"]