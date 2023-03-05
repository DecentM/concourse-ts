import {Task} from '../../declarations'
import {Identifier} from '../../utils/identifier'
import {parse_bytes, type_of} from '../../utils'

import {write_command} from './command'

export const write_task = <Input extends Identifier, Output extends Identifier>(
  name: string,
  task: Task<Input, Output>
): string => {
  return `new Task(${JSON.stringify(name)}, (task) => {
    ${
      type_of(task.image_resource) !== 'undefined'
        ? `task.set_image_resource(${JSON.stringify(task.image_resource)})`
        : ''
    }

    ${
      type_of(task.platform) !== 'undefined'
        ? `task.platform = ${JSON.stringify(task.platform)}`
        : ''
    }

    ${
      type_of(task.run) !== 'undefined'
        ? `task.run = ${write_command(`${name}_run`, task.run)}`
        : ''
    }

    ${
      type_of(task.caches) === 'array' && task.caches.length
        ? `task.add_cache(...${JSON.stringify(task.caches)})`
        : ''
    }

    ${
      type_of(task.container_limits?.cpu) !== 'undefined'
        ? `task.set_cpu_limit_percent(${task.container_limits.cpu})`
        : ''
    }

    ${
      type_of(task.container_limits?.memory) !== 'undefined'
        ? `task.set_memory_limit(${JSON.stringify(
            parse_bytes(task.container_limits.memory)
          )})`
        : ''
    }

    ${
      type_of(task.inputs) === 'array' && task.inputs.length
        ? `task.add_input(...${JSON.stringify(task.inputs)})`
        : ''
    }

    ${
      type_of(task.outputs) === 'array' && task.outputs.length
        ? `task.add_output(...${JSON.stringify(task.outputs)})`
        : ''
    }

    ${
      task.params
        ? Object.entries(task.params)
            .filter(
              ([, value]) =>
                type_of(value) !== 'null' && type_of(value) !== 'undefined'
            )
            .map(([name, value]) => {
              return `task.set_params({
          key: ${JSON.stringify(name)},
          value: ${JSON.stringify(String(value))}
        })`
            })
            .join('\n')
        : ''
    }

    ${
      type_of(task.rootfs_uri) !== 'undefined'
        ? `task.rootfs_uri = ${JSON.stringify(task.rootfs_uri)}`
        : ''
    }
  })`
}
