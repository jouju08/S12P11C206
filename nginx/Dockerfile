FROM nginx:alpine
COPY nginx.conf /etc/nginx/nginx.conf
COPY mime.types /etc/nginx/mime.types
COPY conf.d/ /etc/nginx/conf.d/

EXPOSE 80 443
CMD ["nginx", "-g", "daemon off;"]