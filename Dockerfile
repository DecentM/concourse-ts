FROM node:18-alpine3.17 as base

#########################################
FROM base as depskeleton
WORKDIR /app


COPY package.json yarn.lock ./
COPY ./packages/concourse-ts/package.json ./packages/concourse-ts/package.json

ARG package
COPY ./packages/${package}/package.json ./packages/${package}/package.json

#########################################
FROM depskeleton as proddeps
WORKDIR /app

RUN yarn --frozen-lockfile --non-interactive --production=true

#########################################
FROM proddeps as devdeps
WORKDIR /app

RUN apk add --no-cache python3 make gcc g++
RUN yarn --frozen-lockfile --non-interactive --production=false

#########################################
FROM devdeps as sources
WORKDIR /app

COPY . .

#########################################
FROM sources as build
WORKDIR /app

ARG package
RUN yarn nx build ${package}

#########################################
FROM base as runtime
WORKDIR /app

COPY --from=proddeps /app/node_modules ./node_modules

COPY --from=build /app/dist/ ./
COPY --from=proddeps /app/packages/concourse-ts/node_modules ./packages/concourse-ts/node_modules

ARG package
COPY --from=proddeps /app/packages/${package}/node_modules ./packages/${package}/node_modules

ENV PATH="${PATH}:/app/packages/concourse-ts-cli/bin"
ENV NODE_PATH="${NODE_PATH}:/app/node_modules"

ENTRYPOINT [ "sh", "-eu" ]
