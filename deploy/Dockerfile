FROM nginx:stable-alpine

COPY deploy/default.conf /etc/nginx/conf.d/default.conf
COPY dist/ /usr/share/nignx/html/

EXPOSE 80
