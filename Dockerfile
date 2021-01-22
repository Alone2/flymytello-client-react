FROM alpine:3.12

WORKDIR /app

COPY ./ .

RUN apk add --update --no-cache npm

CMD ["sh", "build.sh"]
