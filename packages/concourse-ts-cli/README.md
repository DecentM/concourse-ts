oclif-hello-world
=================

oclif example Hello World CLI

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/oclif-hello-world.svg)](https://npmjs.org/package/oclif-hello-world)
[![CircleCI](https://circleci.com/gh/oclif/hello-world/tree/main.svg?style=shield)](https://circleci.com/gh/oclif/hello-world/tree/main)
[![Downloads/week](https://img.shields.io/npm/dw/oclif-hello-world.svg)](https://npmjs.org/package/oclif-hello-world)
[![License](https://img.shields.io/npm/l/oclif-hello-world.svg)](https://github.com/oclif/hello-world/blob/main/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g concourse-ts-cli
$ concourse-ts COMMAND
running command...
$ concourse-ts (--version)
concourse-ts-cli/0.0.0 linux-x64 node-v18.12.1
$ concourse-ts --help [COMMAND]
USAGE
  $ concourse-ts COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`concourse-ts hello PERSON`](#concourse-ts-hello-person)
* [`concourse-ts hello world`](#concourse-ts-hello-world)
* [`concourse-ts help [COMMANDS]`](#concourse-ts-help-commands)
* [`concourse-ts plugins`](#concourse-ts-plugins)
* [`concourse-ts plugins:install PLUGIN...`](#concourse-ts-pluginsinstall-plugin)
* [`concourse-ts plugins:inspect PLUGIN...`](#concourse-ts-pluginsinspect-plugin)
* [`concourse-ts plugins:install PLUGIN...`](#concourse-ts-pluginsinstall-plugin-1)
* [`concourse-ts plugins:link PLUGIN`](#concourse-ts-pluginslink-plugin)
* [`concourse-ts plugins:uninstall PLUGIN...`](#concourse-ts-pluginsuninstall-plugin)
* [`concourse-ts plugins:uninstall PLUGIN...`](#concourse-ts-pluginsuninstall-plugin-1)
* [`concourse-ts plugins:uninstall PLUGIN...`](#concourse-ts-pluginsuninstall-plugin-2)
* [`concourse-ts plugins update`](#concourse-ts-plugins-update)

## `concourse-ts hello PERSON`

Say hello

```
USAGE
  $ concourse-ts hello PERSON -f <value>

ARGUMENTS
  PERSON  Person to say hello to

FLAGS
  -f, --from=<value>  (required) Who is saying hello

DESCRIPTION
  Say hello

EXAMPLES
  $ oex hello friend --from oclif
  hello friend from oclif! (./src/commands/hello/index.ts)
```

_See code: [dist/commands/hello/index.ts](https://github.com/DecentM/concourse-ts/blob/v0.0.0/dist/commands/hello/index.ts)_

## `concourse-ts hello world`

Say hello world

```
USAGE
  $ concourse-ts hello world

DESCRIPTION
  Say hello world

EXAMPLES
  $ concourse-ts hello world
  hello world! (./src/commands/hello/world.ts)
```

## `concourse-ts help [COMMANDS]`

Display help for concourse-ts.

```
USAGE
  $ concourse-ts help [COMMANDS] [-n]

ARGUMENTS
  COMMANDS  Command to show help for.

FLAGS
  -n, --nested-commands  Include all nested commands in the output.

DESCRIPTION
  Display help for concourse-ts.
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v5.2.8/src/commands/help.ts)_

## `concourse-ts plugins`

List installed plugins.

```
USAGE
  $ concourse-ts plugins [--core]

FLAGS
  --core  Show core plugins.

DESCRIPTION
  List installed plugins.

EXAMPLES
  $ concourse-ts plugins
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v2.4.1/src/commands/plugins/index.ts)_

## `concourse-ts plugins:install PLUGIN...`

Installs a plugin into the CLI.

```
USAGE
  $ concourse-ts plugins:install PLUGIN...

ARGUMENTS
  PLUGIN  Plugin to install.

FLAGS
  -f, --force    Run yarn install with force flag.
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Installs a plugin into the CLI.
  Can be installed from npm or a git url.

  Installation of a user-installed plugin will override a core plugin.

  e.g. If you have a core plugin that has a 'hello' command, installing a user-installed plugin with a 'hello' command
  will override the core plugin implementation. This is useful if a user needs to update core plugin functionality in
  the CLI without the need to patch and update the whole CLI.


ALIASES
  $ concourse-ts plugins add

EXAMPLES
  $ concourse-ts plugins:install myplugin 

  $ concourse-ts plugins:install https://github.com/someuser/someplugin

  $ concourse-ts plugins:install someuser/someplugin
```

## `concourse-ts plugins:inspect PLUGIN...`

Displays installation properties of a plugin.

```
USAGE
  $ concourse-ts plugins:inspect PLUGIN...

ARGUMENTS
  PLUGIN  [default: .] Plugin to inspect.

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Displays installation properties of a plugin.

EXAMPLES
  $ concourse-ts plugins:inspect myplugin
```

## `concourse-ts plugins:install PLUGIN...`

Installs a plugin into the CLI.

```
USAGE
  $ concourse-ts plugins:install PLUGIN...

ARGUMENTS
  PLUGIN  Plugin to install.

FLAGS
  -f, --force    Run yarn install with force flag.
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Installs a plugin into the CLI.
  Can be installed from npm or a git url.

  Installation of a user-installed plugin will override a core plugin.

  e.g. If you have a core plugin that has a 'hello' command, installing a user-installed plugin with a 'hello' command
  will override the core plugin implementation. This is useful if a user needs to update core plugin functionality in
  the CLI without the need to patch and update the whole CLI.


ALIASES
  $ concourse-ts plugins add

EXAMPLES
  $ concourse-ts plugins:install myplugin 

  $ concourse-ts plugins:install https://github.com/someuser/someplugin

  $ concourse-ts plugins:install someuser/someplugin
```

## `concourse-ts plugins:link PLUGIN`

Links a plugin into the CLI for development.

```
USAGE
  $ concourse-ts plugins:link PLUGIN

ARGUMENTS
  PATH  [default: .] path to plugin

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Links a plugin into the CLI for development.
  Installation of a linked plugin will override a user-installed or core plugin.

  e.g. If you have a user-installed or core plugin that has a 'hello' command, installing a linked plugin with a 'hello'
  command will override the user-installed or core plugin implementation. This is useful for development work.


EXAMPLES
  $ concourse-ts plugins:link myplugin
```

## `concourse-ts plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ concourse-ts plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ concourse-ts plugins unlink
  $ concourse-ts plugins remove
```

## `concourse-ts plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ concourse-ts plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ concourse-ts plugins unlink
  $ concourse-ts plugins remove
```

## `concourse-ts plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ concourse-ts plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ concourse-ts plugins unlink
  $ concourse-ts plugins remove
```

## `concourse-ts plugins update`

Update installed plugins.

```
USAGE
  $ concourse-ts plugins update [-h] [-v]

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Update installed plugins.
```
<!-- commandsstop -->
