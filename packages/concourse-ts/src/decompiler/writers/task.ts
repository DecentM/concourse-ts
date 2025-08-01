import { Task } from '../../declarations/index.js'
import { Identifier } from '../../utils/identifier/index.js'
import { parse_bytes } from '../../utils/index.js'

import { write_command } from './command.js'
import { empty_string_or } from '../../utils/empty_string_or/index.js'

export const write_task = <Input extends Identifier, Output extends Identifier>(
  name: string,
  task: Task<Input, Output>
): string => {
  return `new Task(${JSON.stringify(name)}, (task) => {
    ${empty_string_or(
      task.image_resource,
      (image_resource) =>
        `task.set_image_resource(${JSON.stringify(image_resource)})`
    )}

    ${empty_string_or(
      task.platform,
      (platform) => `task.set_platform(${JSON.stringify(platform)})`
    )}

    ${empty_string_or(task.run, (run) => `task.run = ${write_command(run)}`)}

    ${empty_string_or(
      task.caches,
      (caches) => `task.add_cache(...${JSON.stringify(caches)})`
    )}

    ${empty_string_or(
      task.container_limits?.cpu,
      (cpu) => `task.set_cpu_limit_shares(${cpu})`
    )}

    ${empty_string_or(
      task.container_limits?.memory,
      (memory) => `task.set_memory_limit(${JSON.stringify(parse_bytes(memory))})`
    )}

    ${empty_string_or(
      task.inputs,
      (inputs) =>
        `task.add_input(${inputs.map((input) => JSON.stringify(input)).join(', ')})`
    )}

    ${empty_string_or(
      task.outputs,
      (outputs) =>
        `task.add_output(${outputs
          .map((output) => JSON.stringify(output))
          .join(', ')})`
    )}

    ${empty_string_or(
      task.params,
      (params) => `task.set_params(${JSON.stringify(params)})`
    )}

    ${empty_string_or(
      task.rootfs_uri,
      (rootfs_uri) => `task.set_rootfs_uri(${JSON.stringify(rootfs_uri)})`
    )}
  })`
}
