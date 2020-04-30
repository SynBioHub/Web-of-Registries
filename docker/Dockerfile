FROM node:13.13.0-alpine

WORKDIR /opt/web-of-registries
COPY . . 

RUN mkdir -p /mnt/data && \ 
    touch /mnt/data/config.local.json && \
    ln -s /mnt/data/registries.sqlite data/registries.sqlite && \
    ln -s /mnt/data/config.local.json data/config.local.json

RUN npm install

ENTRYPOINT ["npm", "start"]
