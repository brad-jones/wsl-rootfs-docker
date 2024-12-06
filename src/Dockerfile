ARG TAG="latest"
FROM docker:$TAG
RUN apk add --no-cache openrc log_proxy
COPY ./etc/wsl.conf /etc/wsl.conf
COPY ./etc/init.d/docker /etc/init.d/docker
RUN chmod +x /etc/init.d/docker
RUN rc-update add docker default
