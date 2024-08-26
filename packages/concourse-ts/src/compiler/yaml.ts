import { Document } from 'yaml'

import { Pipeline, Task } from '../declarations/index.js'
import { is_pipeline } from '../utils/index.js'
import { Identifier } from '../utils/identifier/index.js'

const write_yaml_pipeline = (pipeline: Pipeline): string => {
  const document = new Document(pipeline)

  const lines: string[] = [
    `Generated with concourse-ts`,
    '',
    `jobs: ${pipeline.jobs.length}`,
    `groups: ${pipeline.groups?.length ?? 0}`,
    `resource_types: ${pipeline.resource_types?.length ?? 0}`,
    `resources: ${pipeline.resources?.length ?? 0}`,
    `var_sources: ${pipeline.var_sources?.length ?? 0}`,
  ]

  document.commentBefore = lines.map((line) => ` ${line}`).join('\n')

  return document.toString()
}

const write_yaml_task = (task: Task<Identifier, Identifier>): string => {
  const document = new Document(task)
  const now = new Date()

  const lines: string[] = [
    `Generated with concourse-ts at ${now.toLocaleTimeString()} on ${now.toLocaleDateString()}`,
    '',
    `platform: ${task.platform}`,
    `type: ${task.image_resource.type}`,
    `inputs: ${task.inputs?.length ?? 0}`,
    `outputs: ${task.outputs?.length ?? 0}`,
    `params: ${task.params ? Object.keys(task.params).length : 0}`,
  ]

  document.commentBefore = lines.map((line) => ` ${line}`).join('\n')

  return document.toString()
}

export const write_yaml = (
  pipeline_or_task: Pipeline | Task<Identifier, Identifier>
): string => {
  if (is_pipeline(pipeline_or_task)) {
    return write_yaml_pipeline(pipeline_or_task)
  }

  return write_yaml_task(pipeline_or_task)
}
