import * as Type from '../../declarations/types'
import {visit_pipeline} from '../visitors/pipeline'

export const find_job_by_name = (
  job_name: string,
  pipeline: Type.Pipeline
): Type.Job | null => {
  let job: Type.Job | null = null

  visit_pipeline(pipeline, {
    Job: (found_job) => {
      if (found_job.name === job_name) {
        job = found_job
      }
    },
  })

  return job
}
