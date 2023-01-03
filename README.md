<h1 align="center">
  concourse-ts
</h1>

<div align="center">

  A set of libraries for SRE/DevOps teams to generate Concourse pipelines, task
  yaml files, and set or enforce[*](#security) defaults.
</div>

- [`concourse-ts`](#concourse-ts)
  - [About](#about)
  - [Usage](#usage)
    - [Library](#library)
    - [CLI / Compiler](#cli--compiler)
  - [Security](#security)

## `concourse-ts`

### About

Concourse by default accepts yaml as its configuration, which makes it nearly
impossible to reuse code for it. However, the main advantage in this is that
since Concourse is stateless, full pipeline configuration, along with extensions
are completely contained within the yaml file. We can fix the code reusability
issue by creating a library that generates yaml config files.

This is a meta-package that's designed to be used to create a library that's
specific to an organisation's infrastructure. The dependency chain looks like
this: `@corpity-corp/project` > `@corpity-corp/ci` > `@decentm/concourse-ts`.

> If you're a developer using a package that depends on `concourse-ts`, you shouldn't
> install `concourse-ts`. Consult your SRE/DevOps team's documentation about
> using their package. This page is for people looking to create an internal
> package that generates organisation-specific configuration files.

### Usage

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

- In the entrypoint of your package, extend and export the following classes:
  - `Pipeline`
  - `Job`
  - `Task`

- Implement enforced defaults[*](#security) by calling class methods after the
  `super()` call. For example, you can call `this.set_cpu_limit_percent(50)` in
  your `Task` constructor to make all tasks limit CPU usage on workers.

- Extend `Resource` and `ResourceType` as many times as needed to implement
  organisation-specific configuration, like e-mail notifications, webhooks, SCM
  repos, build processes, and test automation.
  - Use the Slack resource type and resource implementation as a starting point
    from `examples/corpity-corp/sre/src/resources/slack.ts` and `examples/corpity-corp/sre/src/resource-types/slack.ts`

#### CLI / Compiler

Create a `cli.ts` file with the following contents:
```typescript
import * as ConcourseCli from '@decentm/concourse-ts/cli'

const main = async () => {
  const props = await ConcourseCli.parseProps(process.argv)
  await ConcourseCli.runApp(props)
}

main().catch(console.error)
```
By default, the CLI will accept `--help`, `--version`, `-i|--input`, and
`-o|--output-directory` arguments. However, if you need to, you can create your
own interface, or use the CLI programmatically by removing the `parseProps` line
and implementing a custom way of getting the props required for the CLI to
function.

> You'll have to add the path of this file relative to the root of your `dist`
> directory to your package.json's `bin` section. That will make it available in
> the end user's `node_modules/.bin` directory.

The CLI accepts a glob input (such as `ci/**/*.ts`), and validates each file
that matches. If there are no issues, it will serialise the pipeline found in
each file and output them under the `outputDirectory` path in a `pipeline` and
`task` directory. Given this input:
```typescript
repo
  |- .git/
    |- // ...
  |- ci/
    |- foo.ts // contains a () => pipeline
    |- bar.ts // contains a () => task
```
The output will be:
```typescript
repo
  |- .git/
    |- // ...
  |- .ci/
    |- pipeline/
      |- foo.yml
    |- task/
      |- bar.yml
  |- ci/
    |- foo.ts
    |- bar.ts
```

It's recommended to instruct end users to commit the generated configuration
files into their repo instead of building them before each build. This ensures
that developers can ensure the safety and stability of a pipeline by being able
to inspect the effective configuration. For ease of use and ensuring that the
generated configuration is always up-to-date, use a git pre-commit hook to
regenerate the yaml configuration during a commit. For an example, see the
`prepare` and `ci` scripts in
`examples/corpity-corp/dev/package.json`, as well as
`examples/corpity-corp/dev/.husky`.

> See the manual for `husky` to learn more about git hooks in this context: https://typicode.github.io/husky/#/?id=automatic-recommended

### Security

Important to note, that enforced defaults only apply to the initialiser
function. Each class can be interacted in two ways by the end user (in this
case, the developer using the `@corpity-corp/ci` package). First, when a `concourse-ts` class is
instantiated, it accepts an optional initialiser function that can be used to
access the constructed object. Second, class instances are available to modify
after they've been created. To make it clear:
```typescript
let thing = null

const task = new Task('my_task', (my_task) => {
  thing = my_task
})

task === thing // true
```
When you set defaults after the `super` call, those statements run after the
initialiser function, but that's not a guarantee that those values will never be
modified. If the end user sets properties or calls functions after the `new`
statement and uses its return value, they can override defaults set here. Take this for example:
```typescript
// @corpity-corp/ci > src/build-task.ts
class BuildTask extends ConcourseTs.Task {
  constructor(name: string, init?: ConcourseTs.Initer<BuildTask>) {
    super(name, init)

    this.set_cpu_limit_percent(25)
  }
}
```

```typescript
// @corpity-corp/projects/zeus-server > ci/build.task.ts
import {BuildTask} from '@corpity-corp/ci'

const buildTask = new BuildTask('my_build', (task) => {
  task.set_cpu_limit_percent(50) // This will be overwritten with 25 by the base class
})

buildTask.set_cpu_limit_percent(75) // This will overwrite the value from the base class
```
In this above case, the final value for the cpu_limit_percent will be 75. Since the
configuration for projects is stored in each project's repo, this library or any
project-level check is not appropriate for security checks. Also avoid directly
inserting secrets into your `@corpity-corp/ci` library, as they'll be written to
disk and visible in the generated YAML config. Use [credential
management](https://concourse-ci.org/creds.html) to handle secrets. That way you
can also ensure that secrets do not show up in build logs.
