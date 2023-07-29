ARG BASE_IMAGE

FROM ${BASE_IMAGE} as base

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

RUN yarn --frozen-lockfile --non-interactive --production=true --network-concurrency=5

#########################################
FROM proddeps as devdeps
WORKDIR /app

RUN apk add --no-cache python3 make gcc g++
RUN yarn --frozen-lockfile --non-interactive --production=false --network-concurrency=5

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
FROM sources as test
WORKDIR /app

ARG package
RUN yarn nx test ${package}

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

#########################################
ARG BASE_IMAGE
FROM ${BASE_IMAGE} AS cli

ARG concourse_ts_cli
ARG concourse_ts
ARG concourse_ts_recipe_auto_pipeline
ARG concourse_ts_recipe_oci_build
ARG concourse_ts_recipe_npm_dependencies
ARG concourse_ts_resource_npm
ARG concourse_ts_resource_registry_image
ARG typescript

RUN yarn global add \
  --non-interactive \
  --production=false \
  --network-concurrency=5 \
  @decentm/concourse-ts-cli@${concourse_ts_cli} \
  @decentm/concourse-ts@${concourse_ts} \
  @decentm/concourse-ts-recipe-auto-pipeline@${concourse_ts_recipe_auto_pipeline} \
  @decentm/concourse-ts-recipe-oci-build@${concourse_ts_recipe_oci_build} \
  @decentm/concourse-ts-recipe-npm-dependencies@${concourse_ts_recipe_npm_dependencies} \
  @decentm/concourse-ts-resource-npm@${concourse_ts_resource_npm} \
  @decentm/concourse-ts-resource-registry-image@${concourse_ts_resource_registry_image} \
  typescript@${typescript}

ENV NODE_PATH="${NODE_PATH}:/usr/local/share/.config/yarn/global/node_modules"

CMD ["concourse-ts"]
