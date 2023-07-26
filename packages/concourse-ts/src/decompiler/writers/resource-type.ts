import {VError} from 'verror'

import {Pipeline} from '../../declarations'
import {parse_duration} from '../../utils/duration'
import {empty_string_or} from '../../utils/empty_string_or'

export const write_resource_type = (
  resource_type_name: string,
  pipeline: Pipeline
) => {
  const resource_type = pipeline.resource_types?.find((resource_type) => {
    return resource_type.name === resource_type_name
  })

  if (!resource_type) {
    throw new VError(
      `Resource type "${resource_type_name}" does not exist in the pipeline`
    )
  }

  return `new ResourceType(${JSON.stringify(resource_type.name)}, (rt) => {
    ${empty_string_or(
      resource_type.type,
      (type) => `rt.set_type(${JSON.stringify(type)})`
    )}

    ${empty_string_or(
      resource_type.source,
      (source) => `rt.source = ${JSON.stringify(source)}`
    )}

    ${empty_string_or(
      resource_type.check_every,
      (check_every) =>
        `rt.set_check_every(${JSON.stringify(parse_duration(check_every))})`
    )}

    ${empty_string_or(
      resource_type.defaults,
      (defaults) => `rt.set_defaults(${JSON.stringify(defaults)})`
    )}

    ${empty_string_or(
      resource_type.params,
      (params) => `rt.set_params(${JSON.stringify(params)})`
    )}

    ${empty_string_or(
      resource_type.privileged,
      (privileged) => `rt.privileged = ${privileged}`
    )}

    ${empty_string_or(
      resource_type.tags,
      (tags) =>
        `rt.add_tag(${tags.map((tag) => JSON.stringify(tag)).join(', ')})`
    )}
  })`
}
