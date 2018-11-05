FROM kkarczmarczyk/node-yarn:7.6-slim
MAINTAINER Stefan Walther

ARG PORT=3004
ENV PORT=$PORT

ENV HOME /home
RUN mkdir -p $HOME

WORKDIR $HOME

COPY package.json yarn.lock index.js / ./

RUN npm install --progress=false && \
    npm install -g nodemon

EXPOSE $PORT

CMD ["yarn", "run", "start"]
