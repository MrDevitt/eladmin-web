FROM nginx:stable-alpine3.17
RUN rm /etc/nginx/conf.d/default.conf
COPY ./dist /usr/share/nginx/html
COPY eladmin.conf /etc/nginx/conf.d/eladmin.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
