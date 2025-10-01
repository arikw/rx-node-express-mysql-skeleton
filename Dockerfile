FROM node:24-alpine

ARG SERVER_DIR=/server
WORKDIR $SERVER_DIR

ARG NODE_ENV=production
ENV NODE_ENV=$NODE_ENV

# first install dependencies
COPY --chown=node package.json package-lock.json $SERVER_DIR/
RUN npm install --no-fund --no-audit --loglevel verbose

# copy the code (skipping files in .dockerignore)
COPY --chown=node . $SERVER_DIR

# Args are overriden by docker-compose.yaml
ARG PORT=4000
ENV PORT=$PORT

# avoid .env when running in production environment
RUN ([ $NODE_ENV == "production" ] && rm -f .env) || true

EXPOSE $PORT

CMD [ "npm", "start" ]