// https://github.com/concourse/concourse/blob/6e9795b98254c86ca1c5ebed138d427424eae5f1/atc/configvalidate/validate.go#L500

import * as Type from '../../declarations/types'
import {ValidationWarningType, WarningStore} from './declarations'

enum VisitStatus {
  NonVisited,
  SemiVisited,
  AlreadyVisited,
}

const findJobByName = (jobName: string, pipeline: Type.Pipeline): Type.Job => {
  return pipeline.jobs.find((job) => job.name === jobName)
}

export const detectCycle = (
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

      step.passed.forEach((passedStep) => {
        const nextJob = findJobByName(passedStep, pipeline)

        if (visited[nextJob.name] === VisitStatus.SemiVisited) {
          return warnings.add_warning(
            ValidationWarningType.Fatal,
            `pipeline contains a cycle that starts at Job ${nextJob.name}`
          )
        } else if (visited[nextJob.name] === VisitStatus.NonVisited) {
          return detectCycle(nextJob, visited, pipeline, warnings)
        }

        return warnings
      })
    })

  visited[job.name] = VisitStatus.AlreadyVisited

  return warnings
}

export const validateCycle = (pipeline: Type.Pipeline): WarningStore => {
  const visitedJobsMap = {}
  const warnings = new WarningStore()
  const jobs = pipeline.jobs

  // Initialise all with 0
  jobs.forEach((job) => {
    visitedJobsMap[job.name] = VisitStatus.NonVisited
  })

  jobs.forEach((job) => {
    detectCycle(job, visitedJobsMap, pipeline, warnings)
  })

  return warnings
}
