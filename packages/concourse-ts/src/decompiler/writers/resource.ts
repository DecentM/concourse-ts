import {VError} from 'verror'
import {Pipeline} from '../../declarations'
import {parse_duration, type_of} from '../../utils'

import {write_resource_type} from './resource-type'

export const write_resource = (
  resource_name: string,
  pipeline: Pipeline
): string => {
  const resource = pipeline.resources.find((resource) => {
    resource.name === resource_name
  })

  if (!resource) {
    throw new VError(`Resource ${resource_name} does not exist in the pipeline`)
  }

  return `new Resource(${JSON.stringify(resource.name)}, ${write_resource_type(
    resource.type,
    pipeline
  )}, (r) => {
    ${
      type_of(resource.source) !== 'undefined'
        ? `r.source = ${JSON.stringify(resource.source)}`
        : ''
    }

    ${
      type_of(resource.check_every) !== 'undefined'
        ? `r.set_check_every(${parse_duration(resource.check_every)})`
        : ''
    }

    ${
      type_of(resource.icon) !== 'undefined'
        ? `r.icon = ${JSON.stringify(resource.icon)}`
        : ''
    }

    ${
      type_of(resource.old_name) !== 'undefined'
        ? `r.old_name = ${JSON.stringify(resource.old_name)}`
        : ''
    }

    ${
      type_of(resource.public) !== 'undefined'
        ? `r.public = ${resource.public}`
        : ''
    }

    ${
      type_of(resource.tags) === 'array' && resource.tags.length
        ? `r.add_tag(...${resource.tags})`
        : ''
    }

    ${
      type_of(resource.version) !== 'undefined'
        ? `r.set_version(${JSON.stringify(resource.version)})`
        : ''
    }

    ${
      type_of(resource.webhook_token) !== 'undefined'
        ? `r.webhook_token = ${JSON.stringify(resource.webhook_token)}`
        : ''
    }
  })`
}
