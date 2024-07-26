ARG NODE_VERSION

FROM node:${NODE_VERSION}-bookworm-slim AS base
ENV SHELL=/bin/sh

#########################################
FROM base AS depskeleton
WORKDIR /app

COPY ./.moon/docker/workspace .

RUN corepack enable

#########################################
FROM depskeleton AS proddeps
WORKDIR /app

RUN yarn workspaces focus -A --production

#########################################
FROM proddeps AS devdeps
WORKDIR /app

RUN apt update && apt install -y python3 make gcc g++
RUN yarn --immutable

#########################################
FROM devdeps AS sources
WORKDIR /app

COPY . .

#########################################
FROM sources AS build
WORKDIR /app

RUN yarn moon :build

#########################################
FROM build AS test
WORKDIR /app

RUN yarn moon #testable:test

#########################################
FROM sources AS lint
WORKDIR /app

RUN yarn moon :lint

#########################################
FROM base AS runtime
WORKDIR /app

COPY --from=proddeps /app/node_modules ./node_modules

ENV PATH="${PATH}:/app/packages/concourse-ts-cli/bin"
ENV NODE_PATH="${NODE_PATH}:/app/node_modules"

ENTRYPOINT [ "sh", "-eu" ]
