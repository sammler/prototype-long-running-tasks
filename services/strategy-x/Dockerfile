FROM kkarczmarczyk/node-yarn:7.2-slim
MAINTAINER Stefan Walther

ARG PORT=3004
ENV PORT=$PORT

ENV HOME /home
RUN mkdir -p $HOME

WORKDIR $HOME

COPY package.json yarn.lock ./

RUN yarn install \
  #yarn global add does not work, for whatever reasons
  && npm install -g nodemon

COPY / ./

EXPOSE $PORT

CMD ["yarn", "run", "start"]
