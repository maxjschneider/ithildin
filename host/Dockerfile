FROM node:18-alpine3.17 AS build

FROM ubuntu
RUN apt-get update
RUN apt-get install nginx -y

COPY nginx.conf /etc/nginx/

COPY server.crt /usr/local/nginx/conf/server.crt
COPY server.key /usr/local/nginx/conf/server.key

EXPOSE 2053
CMD ["nginx","-g","daemon off;"]