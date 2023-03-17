// https://github.com/concourse/concourse/blob/6e9795b98254c86ca1c5ebed138d427424eae5f1/atc/configvalidate/validate.go#L500

import * as Type from '../declarations/types'

import {find_job_by_name} from '../utils/find-job'
import {ValidationWarningType, WarningStore} from '../utils/warning-store'

enum VisitStatus {
  NonVisited,
  SemiVisited,
  AlreadyVisited,
}

export const detect_cycle = (
  job: Type.Job,
  visited: Record<string, VisitStatus>,
  pipeline: Type.Pipeline,
  warnings: WarningStore
): WarningStore => {
  visited[job.name] = VisitStatus.SemiVisited

  job.plan
    .filter((step) => 'get' in step)
    .forEach((step: Type.GetStep): void => {
      if (!step.passed || step.passed.length === 0) {
        return
      }

      step.passed.forEach((passed_job) => {
        const next_job = find_job_by_name(passed_job, pipeline)

        if (!next_job) {
          return warnings.add_warning(
            ValidationWarningType.Fatal,
            `job "${job.name}" contains a step that relies on a non-existent job: "${passed_job}"`
          )
        }

        if (visited[next_job.name] === VisitStatus.SemiVisited) {
          return warnings.add_warning(
            ValidationWarningType.Fatal,
            `pipeline contains a cycle that starts at Job "${next_job.name}"`
          )
        } else if (visited[next_job.name] === VisitStatus.NonVisited) {
          return detect_cycle(next_job, visited, pipeline, warnings)
        }

        return warnings
      })
    })

  visited[job.name] = VisitStatus.AlreadyVisited

  return warnings
}

export const validate_cycle = (pipeline: Type.Pipeline): WarningStore => {
  const visited_jobs_map = {}
  const warnings = new WarningStore()
  const jobs = pipeline.jobs

  // Initialise all with 0
  jobs?.forEach((job) => {
    visited_jobs_map[job.name] = VisitStatus.NonVisited
  })

  jobs?.forEach((job) => {
    detect_cycle(job, visited_jobs_map, pipeline, warnings)
  })

  return warnings
}
