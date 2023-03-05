import {VError} from 'verror'
import {Pipeline} from '../../declarations'
import {parse_duration} from '../../utils/duration'
import {type_of} from '../../utils'

export const write_resource_type = (
  resource_type_name: string,
  pipeline: Pipeline
) => {
  const resource_type = pipeline.resource_types.find((resource_type) => {
    resource_type.name === resource_type_name
  })

  if (!resource_type) {
    throw new VError(
      `Resource type "${resource_type}" does not exist in the pipeline`
    )
  }

  return `new ResourceType(${JSON.stringify(resource_type.name)}, (rt) => {
    ${
      type_of(resource_type.type) !== 'undefined'
        ? `rt.type = ${JSON.stringify(resource_type.type)}`
        : ''
    }

    ${
      type_of(resource_type.source) !== 'undefined'
        ? `rt.source = ${JSON.stringify(resource_type.source)}`
        : ''
    }

    ${
      type_of(resource_type.check_every) !== 'undefined'
        ? `rt.check_every = ${JSON.stringify(
            parse_duration(resource_type.check_every)
          )}`
        : ''
    }

    ${Object.entries(resource_type.defaults)
      .map(([name, value]) => {
        return `rt.set_default(${JSON.stringify(name)}, ${JSON.stringify(
          value
        )}})`
      })
      .join('\n')}

    ${Object.entries(resource_type.params)
      .map(([name, value]) => {
        return `rt.set_param(${JSON.stringify(name)}, ${JSON.stringify(
          value
        )}})`
      })
      .join('\n')}

    ${
      type_of(resource_type.privileged) !== 'undefined'
        ? `rt.privileged = ${resource_type.privileged}`
        : ''
    }

    ${
      type_of(resource_type.tags) === 'array' && resource_type.tags.length
        ? `rt.add_tag(...${resource_type.tags})`
        : ''
    }
  })`
}
