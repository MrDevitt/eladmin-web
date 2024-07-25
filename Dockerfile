FROM --platform=linux/amd64 nginx:stable-alpine3.17
#FROM nginx:stable-alpine3.17
RUN rm /etc/nginx/conf.d/default.conf
COPY ./dist /usr/share/nginx/html
COPY eladmin.conf /etc/nginx/conf.d/eladmin.conf
COPY keyuanadmin.top.key /root/card/keyuanadmin.top.key
COPY keyuanadmin.top.pem /root/card/keyuanadmin.top.pem
EXPOSE 443
CMD ["nginx", "-g", "daemon off;"]
