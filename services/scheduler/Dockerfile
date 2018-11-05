FROM kkarczmarczyk/node-yarn:7.6-slim
MAINTAINER Stefan Walther

ARG PORT=3004
ENV PORT=$PORT

ENV HOME /home
RUN mkdir -p $HOME

WORKDIR $HOME

COPY package.json yarn.lock index.js / ./

RUN yarn install
RUN npm install -g nodemon #yarn global add does not work, for whatever reasons

EXPOSE $PORT

CMD ["yarn", "run", "start"]
