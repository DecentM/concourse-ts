import * as Type from '../declarations/types'

import {is_task_step} from '../utils/step-type'

import {ValidationWarningType, WarningStore} from '../utils/warning-store'

/**
 * https://www.ibm.com/docs/en/aix/7.2?topic=kspsbic-regular-built-in-command-descriptions-korn-shell-posix-shell
 */
const common_shell_builtins = [
  'alias',
  'fg',
  'print',
  'ulimit',
  'bg',
  'getopts',
  'pwd',
  'umask',
  'cd',
  'jobs',
  'read',
  'unalias',
  'command',
  'kill',
  'setgroups',
  'wait',
  'echo',
  'let',
  'setsenv',
  'test',
  'whence',
  'fc',
]

export const validate_commands = (pipeline: Type.Pipeline) => {
  const warnings = new WarningStore()

  pipeline.jobs.forEach((job) => {
    job.plan.forEach((step) => {
      if (!is_task_step(step) || !step.config) {
        return
      }

      const command = step.config.run

      if (!command.path) {
        warnings.add_warning(
          ValidationWarningType.Fatal,
          `Command ${
            command.dir ? `running in "${command.dir}" ` : ''
          }contains no path. Add a path to a binary to fix this (for example: "/bin/sh").`
        )

        return
      }

      if (
        !command.path.startsWith('/') &&
        !common_shell_builtins.includes(command.path)
      ) {
        warnings.add_warning(
          ValidationWarningType.NonFatal,
          `Command "${command.path}" uses a binary from $PATH! This makes it vulnerable to injection attacks. Specify the absolute path of the binary to fix this warning. (e.g.: "/bin/${command.path}" instead of "${command.path}")`
        )
      }
    })
  })

  return warnings
}
