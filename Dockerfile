ARG NODE_VERSION

FROM node:${NODE_VERSION}-alpine as base

#########################################
FROM base as depskeleton
WORKDIR /app

COPY package.json yarn.lock ./

#########################################
FROM depskeleton as proddeps
WORKDIR /app

RUN yarn workspaces focus -A --production --network-concurrency=5

#########################################
FROM proddeps as devdeps
WORKDIR /app

RUN apk add --no-cache python3 make gcc g++
RUN yarn install --immutable --inline-builds

#########################################
FROM devdeps as sources
WORKDIR /app

COPY . .

#########################################
FROM sources as build
WORKDIR /app

RUN yarn moon :build

#########################################
FROM build as test
WORKDIR /app

RUN yarn moon #testable:test

#########################################
FROM sources as lint
WORKDIR /app

RUN yarn moon :lint

#########################################
FROM base as runtime
WORKDIR /app

COPY --from=proddeps /app/node_modules ./node_modules

COPY --from=moon /app/dist/ ./
COPY --from=proddeps /app/packages/concourse-ts/node_modules ./packages/concourse-ts/node_modules

ENV PATH="${PATH}:/app/packages/concourse-ts-cli/bin"
ENV NODE_PATH="${NODE_PATH}:/app/node_modules"

ENTRYPOINT [ "sh", "-eu" ]
