############### 1. BUILD STAGE ###############
FROM node:lts-alpine AS build

RUN mkdir -p /opt/app
WORKDIR /opt/app

COPY package*.json ./
RUN npm set progress=false ; npm i -g pkg && npm i --unsafe-perm

COPY . .
RUN npm run build

############### 2. RELEASE STAGE ###############
FROM alpine:latest AS release

ARG APP_NAME
ENV APP_NAME $APP_NAME
ENV USER=docker
ENV UID=1111
ENV GID=1111

RUN addgroup --gid "$GID" "$USER" \
    && adduser \
    --disabled-password \
    --gecos "" \
    --home "$(pwd)" \
    --ingroup "$USER" \
    --no-create-home \
    --uid "$UID" \
    "$USER" && \
    apk update && apk add --no-cache libstdc++ && \
    rm -rf /var/cache/apk/*

USER docker

COPY --from=build /opt/app/${APP_NAME} /bin

CMD $APP_NAME