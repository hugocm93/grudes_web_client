FROM node:19 as base
WORKDIR /app
EXPOSE 3000

FROM base as prod
COPY . .
ENTRYPOINT ./run.sh

FROM base as dev
ENTRYPOINT ./run.sh debug
