import VError from 'verror'
import { Pipeline } from '../../declarations/index.js'
import { parse_duration } from '../../utils/duration/index.js'

import { write_resource_type } from './resource-type.js'
import { empty_string_or } from '../../utils/empty_string_or/index.js'

export const write_resource = (
  resource_name: string,
  pipeline: Pipeline
): string => {
  const resource = pipeline.resources?.find((resource) => {
    return resource.name === resource_name
  })

  if (!resource) {
    throw new VError(`Resource "${resource_name}" does not exist in the pipeline`)
  }

  return `new Resource(${JSON.stringify(resource.name)}, ${write_resource_type(
    resource.type,
    pipeline
  )}, (r) => {
    ${empty_string_or(
      resource.source,
      (source) => `r.source = ${JSON.stringify(source)}`
    )}

    ${empty_string_or(
      resource.check_every,
      (check_every) =>
        `r.set_check_every(${JSON.stringify(parse_duration(check_every))})`
    )}

    ${empty_string_or(resource.icon, (icon) => `r.icon = ${JSON.stringify(icon)}`)}

    ${empty_string_or(
      resource.old_name,
      (old_name) => `r.old_name = ${JSON.stringify(old_name)}`
    )}

    ${empty_string_or(resource.public, (is_public) => `r.public = ${is_public}`)}

    ${empty_string_or(
      resource.tags,
      (tags) => `r.add_tag(${tags.map((tag) => JSON.stringify(tag)).join(', ')})`
    )}

    ${empty_string_or(
      resource.version,
      (version) => `r.set_version(${JSON.stringify(version)})`
    )}

    ${empty_string_or(
      resource.webhook_token,
      (webhook_token) => `r.webhook_token = ${JSON.stringify(webhook_token)}`
    )}
  })`
}
