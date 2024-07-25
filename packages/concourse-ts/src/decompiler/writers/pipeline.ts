import { Job, Pipeline } from '../../declarations/index.js'
import { empty_string_or } from '../../utils/empty_string_or/index.js'

import { write_job } from './job.js'

export const write_pipeline = (name: string, pipeline: Pipeline): string => {
  const find_group_for_job = (job: Job) => {
    const group = pipeline.groups?.find((group) => group.jobs.includes(job.name))

    return group?.name ?? null
  }

  return `new Pipeline(${JSON.stringify(name)}, (pipeline) => {
    ${empty_string_or(pipeline.jobs, (jobs) =>
      jobs
        .map((job, index) => {
          const group = find_group_for_job(job)

          return group
            ? `pipeline.add_job(${write_job(
                `${name}_job-${index}`,
                job,
                pipeline
              )}, ${JSON.stringify(group)})`
            : `pipeline.add_job(${write_job(`${name}_job-${index}`, job, pipeline)})`
        })
        .join('\n')
    )}

    ${empty_string_or(
      pipeline.display,
      (display) =>
        `pipeline.set_background_image_url(${JSON.stringify(
          display.background_image
        )})`
    )}

    ${empty_string_or(pipeline.var_sources, (var_sources) =>
      var_sources
        .map(
          (var_source) => `pipeline.add_var_source(${JSON.stringify(var_source)})`
        )
        .join('\n')
    )}
  })`
}
