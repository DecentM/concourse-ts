import {Identifier} from '../identifier'
import * as Type from '../../declarations/types'

import {
  is_do_step,
  is_get_step,
  is_in_parallel_step,
  is_load_var_step,
  is_put_step,
  is_set_pipeline_step,
  is_task_step,
  is_try_step,
} from '../step-type'

export type StepVisitor = {
  GetStep?: (component: Type.GetStep) => void
  PutStep?: (component: Type.PutStep) => void
  TaskStep?: (component: Type.TaskStep) => void
  SetPipelineStep?: (component: Type.SetPipelineStep) => void
  LoadVarStep?: (component: Type.LoadVarStep) => void
  InParallelStep?: (component: Type.InParallelStep) => void
  DoStep?: (component: Type.DoStep) => void
  TryStep?: (component: Type.TryStep) => void

  OnAbort?: (component: Type.Step) => void
  OnError?: (component: Type.Step) => void
  OnFailure?: (component: Type.Step) => void
  OnSuccess?: (component: Type.Step) => void

  Ensure?: (component: Type.Step) => void

  Task?: (component: Type.Task<Identifier, Identifier>) => void
}

export const visit_step = (step: Type.Step, visitor: StepVisitor) => {
  if (is_do_step(step) && visitor.DoStep) visitor.DoStep(step)

  if (is_get_step(step) && visitor.GetStep) visitor.GetStep(step)

  if (is_in_parallel_step(step) && visitor.InParallelStep)
    visitor.InParallelStep(step)

  if (is_load_var_step(step) && visitor.LoadVarStep) visitor.LoadVarStep(step)

  if (is_put_step(step) && visitor.PutStep) visitor.PutStep(step)

  if (is_task_step(step)) {
    if (visitor.TaskStep) visitor.TaskStep(step)
    if (step.config && visitor.Task) visitor.Task(step.config)
  }

  if (is_set_pipeline_step(step) && visitor.SetPipelineStep)
    visitor.SetPipelineStep(step)

  if (is_try_step(step) && visitor.TryStep) visitor.TryStep(step)

  if (step.on_abort) {
    if (visitor.OnAbort) visitor.OnAbort(step.on_abort)

    visit_step(step.on_abort, visitor)
  }

  if (step.on_error) {
    if (visitor.OnError) visitor.OnError(step.on_error)

    visit_step(step.on_error, visitor)
  }

  if (step.on_failure) {
    if (visitor.OnFailure) visitor.OnFailure(step.on_failure)

    visit_step(step.on_failure, visitor)
  }

  if (step.on_success) {
    if (visitor.OnSuccess) visitor.OnSuccess(step.on_success)

    visit_step(step.on_success, visitor)
  }

  if (step.ensure) {
    if (visitor.Ensure) visitor.Ensure(step.ensure)

    visit_step(step.ensure, visitor)
  }
}
