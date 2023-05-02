import * as Type from '../../declarations/types'

export type PipelineVisitor = {
  Resource?: (component: Type.Resource) => void
  ResourceType?: (component: Type.ResourceType) => void

  Job?: (component: Type.Job) => void
}

export const visit_pipeline = (
  pipeline: Type.Pipeline,
  visitor: PipelineVisitor
) => {
  if (pipeline.resources && visitor.Resource) {
    pipeline.resources.forEach(visitor.Resource)
  }

  if (pipeline.resource_types && visitor.ResourceType) {
    pipeline.resource_types.forEach(visitor.ResourceType)
  }

  if (pipeline.jobs) {
    pipeline.jobs.forEach((job) => {
      visitor.Job(job)
    })
  }
}
