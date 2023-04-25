<h1 align="center">
  concourse-ts
</h1>

<div align="center">

  A set of libraries for SRE/DevOps teams to generate Concourse pipelines, task
  yaml files, and set defaults[\*](#security).

</div>

<div align="center">

  [![GitHub Workflow
  Status](https://img.shields.io/github/actions/workflow/status/DecentM/concourse-ts/publish.yml?style=for-the-badge)](https://github.com/DecentM/concourse-ts/actions)
  [![npm
  (scoped)](https://img.shields.io/npm/v/@decentm/concourse-ts?style=for-the-badge)
  ![npm bundle size (scoped)](https://img.shields.io/bundlephobia/min/@decentm/concourse-ts?style=for-the-badge)](https://bundlephobia.com/package/@decentm/concourse-ts)
  ![NPM](https://img.shields.io/npm/l/@decentm/concourse-ts?style=for-the-badge)
  ![Snyk Vulnerabilities for npm scoped
  package](https://img.shields.io/snyk/vulnerabilities/npm/@decentm/concourse-ts?style=for-the-badge)
  ![Libraries.io dependency status for latest release, scoped npm package](https://img.shields.io/librariesio/release/npm/@decentm/concourse-ts?style=for-the-badge)

</div>

- [`@decentm/concourse-ts`](#decentmconcourse-ts)
  - [About concourse-ts](#about-concourse-ts)
  - [Programmatic usage](#programmatic-usage)
    - [Library](#library)
  - [Security](#security)
- [`@decentm/concourse-ts-cli`](#decentmconcourse-ts-cli)
  - [About the CLI](#about-the-cli)
  - [Command line usage](#command-line-usage)
  - [Features](#features)
    - [Compilation](#compilation)
    - [Decompilation](#decompilation)

## `@decentm/concourse-ts`

### About concourse-ts

Concourse by default accepts yaml as its configuration, which makes it nearly
impossible to reuse code for it. Its main advantage is its statelessness and
self-contained nature, but this makes config reuse diffucult. We can fix the
code reusability issue by creating a library that generates yaml using code.

This is a meta-package that's designed to be used to create a library that's
specific to an organisation's infrastructure. The dependency chain looks like
this: `@corpity-corp/project` > `@corpity-corp/ci` > `@decentm/concourse-ts`.

> If you're a developer using a package that depends on `concourse-ts`, you shouldn't
> install `concourse-ts`. Consult your SRE/DevOps team's documentation about
> using their package. This page is for people looking to write Pipelines from
> scratch, or those who are creating an organisation-specific package that
> customises `concourse-ts`.

### Programmatic usage

For the sake of example, the name `corpity-corp` is used throughout this repo
when talking about a theoretical organisation using `concourse-ts`.

- Create a new package
  - `yarn init -y`
  - `npm init`

- Install the package as a production dependency. This will make sure your users
    will be able to install everything easily and have the same version
  - `yarn add @decentm/concourse-ts`
  - `npm i --save @decentm/concourse-ts`

#### Library

The most friendly way to use `concourse-ts` is to create an NPM package that
depends on `concourse-ts` and publishing it to your private registry. This will
allow you to harness the power of `concourse-ts` while adding
organisation-specific defaults.

- In the entrypoint of your package, extend and export the following classes:
  - `Pipeline`
  - `Job`
  - `Task`

- Implement defaults[\*](#security) by calling the `customise` static function
  on classes. For example, you can call `task.set_cpu_limit_shares(1)` in
    your `Task` customiser to make all tasks limit CPU usage on workers.

- Extend `Resource` and `ResourceType` as many times as needed to implement
    organisation-specific configuration, like e-mail notifications, webhooks, SCM
    repos, build processes, and test automation.

### Security

Important to note, that defaults only apply to the customiser
function. Each class can be interacted in two ways by the end user (in this
case, the developer using the `@corpity-corp/ci` package). First, when a
`concourse-ts` class is instantiated, it accepts an optional initialiser
function that can be used to access the constructed object. Second, class
instances are available to modify  after they've been created. To make it clear:

```typescript
let thing = null

const task = new Task('my_task', (my_task) => {
  thing = my_task
})

task === thing // true
```

When you set defaults on a class with .customise(), those statements run after
the initialiser function, but that's not a guarantee that those values will
never be modified. If the end user sets properties or calls functions after the
`new` statement and uses its return value, they can override defaults set here.
Take this for example:

```typescript
// @corpity-corp/ci > src/build-task.ts
Task.customise((task) => {
  task.set_cpu_limit_percent(25)
})
```

```typescript
// @corpity-corp/projects/zeus-server > ci/build.task.ts
import {BuildTask} from '@corpity-corp/ci'

const build_task = new BuildTask('my_build', (task) => {
  // This will be overwritten with 25 by the base class
  task.set_cpu_limit_shares(1)
})

// This will overwrite the value from the base class
build_task.set_cpu_limit_shares(2)

// CPU limit is 2 here
```

In this above case, the final value for the cpu_limit_percent will be 75. Since the
configuration for projects is stored in each project's repo, this library or any
project-level check is not appropriate for security checks. Also avoid directly
inserting secrets into your `@corpity-corp/ci` library, as they'll be written to
disk and visible in the generated YAML config. Use [credential
management](https://concourse-ci.org/creds.html) to handle secrets. That way you
can also ensure that secrets do not show up in build logs.

## `@decentm/concourse-ts-cli`

### About the CLI

The `concourse-ts` command line package reads a typescript pipeline, compiles
it to valid Concourse YAML syntax, and writes it to disk. Run `concourse-ts
--help` to view documentation for the command syntax.

> The input file must contain valid Typescript code, that has a default export
> that returns either a `Pipeline` instance or a promise that resolves to a
> `Pipeline` instance.

### Command line usage

There are two ways to compile a `concourse-ts` Pipeline file. Your needs and
team's requirements will determine which one to use, both are supported.

- First is to install `@decentm/concourse-ts-cli` as a `devDependency` in your
  project, and [set up a husky hook](https://github.com/typicode/husky) to
  compile your pipeline during `git commit`. This means that the actual YAML
  pipeline file will be visible in your repository.
  - Advantages:
    - Easy to view your pipeline evolve, and guarantee that you have the last
      say in what your CI will execute.
    - Ability to run generated tasks locally with Concourse's `fly` CLI
      (requires the `--extract-tasks` or `-e` option).
    - Native support for self-setting pipelines (e.g. `set-pipeline: "self"`).
      Since the actual YAML files are in your repository, your set-pipeline step
      will be very fast.
  - Disadvantages:
    - You have to install `@decentm/concourse-ts-cli` in your repository as a
      `devDependency`, and keep it up to date and in sync with your version of
      `concourse-ts` in each project.
    - Both the pipeline source and the compiled yaml output will be present in
      your repository, making it slightly more cluttered.
    - If another developer commits with `git commit -n`, they will be able to
      run a pipeline that doesn't match the output of your `concourse-ts`
      pipeline file.
- Second is to use the `decentm/concourse-ts-cli` Docker image to compile the
  pipeline just before the `set-pipeline` step.
  - Advantages:
    - No need to install the CLI NPM package locally or keep it up to date.
    - Compiled YAML output is **NOT** committed to the repository, keeping the
      codebase cleaner.
    - The pipeline executed in your CI is guaranteed to be the same as the
      output of your `concourse-ts` Pipeline file.
    - Language agnosticity; you don't need to install NodeJS or Typescript into
      your project to compile pipelines.
  - Disadvantages:
    - Your pipeline's history is only visible in the Typescript file. If someone
      is familiar with Concourse configuration, but not `concourse-ts`, they
      will have a harder time tracking down bugs, for example in `git blame`.
    - Since compiled YAML files are not readily available, you can't use `fly`
      to run indivisual tasks (unless you pull the `decentm/concourse-ts-cli`
      docker image locally and use Docker to run it)
    - No native `set-pipeline` speed. Before your `set-pipeline` step, you must
      include a step that uses the Docker image to compile your Pipeline file.

### Features

#### Compilation

Use the `compile` command to compile a `concourse-ts` Typescript file into a
valid Concourse YAML file.

Examples:

```sh
cat ci/pipeline.ts | concourse-ts compile > .ci/pipeline.yml
# No output

concourse-ts compile -i ci/pipeline.ts -o .ci/pipeline.yml -f
# No output

concourse-ts compile < ci/pipeline.ts
# Outputs the resulting YAML, because no "-o" was provided, and output
# is not redirected
```

#### Decompilation

Use the `decompile` command to convert an existing Concourse YAML pipeline file
to valid `concourse-ts` typescript code.

> This command generates code in a non-human-friendly way, where components may
> be functionally duplicated if multiple similar configurations exist in the
> source YAML. After decompilation, it's strongly recommended to **review** the
> generated code and **refactor** it.

Examples:

```sh
cat .ci/pipeline.yml | concourse-ts decompile > ci/pipeline.ts
# No output

concourse-ts decompile -i .ci/pipeline.yml -o ci/pipeline.ts
# No output

concourse-ts decompile < .ci/pipeline.yml
# Outputs the resulting Typescript code, because no "-o" was provided,
# and output is not redirected
```
