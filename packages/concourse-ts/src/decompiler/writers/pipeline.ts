import {Job, Pipeline} from '../../declarations'

import {write_job} from './job'

export const write_pipeline = (name: string, pipeline: Pipeline): string => {
  const find_group_for_job = (job: Job) => {
    const group = pipeline.groups?.find((group) =>
      group.jobs.includes(job.name)
    )

    return group?.name ?? null
  }

  return `new Pipeline(${JSON.stringify(name)}, (pipeline) => {
    ${pipeline.jobs
      .map((job, index) => {
        const group = find_group_for_job(job)

        return group
          ? `pipeline.add_job(${write_job(
              `${name}_job-${index}`,
              job,
              pipeline
            )}, ${JSON.stringify(group)})`
          : `pipeline.add_job(${write_job(
              `${name}_job-${index}`,
              job,
              pipeline
            )})`
      })
      .join('\n')}

    ${
      pipeline.display
        ? `pipeline.set_background_image_url(${JSON.stringify(
            pipeline.display.background_image
          )})`
        : ''
    }

    ${
      pipeline.var_sources
        ? `pipeline.add_var_source(...${JSON.stringify(pipeline.var_sources)})`
        : ''
    }
  })`
}
