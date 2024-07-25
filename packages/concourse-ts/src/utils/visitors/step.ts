import * as Type from '../../declarations/types.js'

import {
  is_do_step,
  is_in_parallel_step,
  is_step,
  is_try_step,
} from '../step-type/index.js'

export type StepVisitor = {
  Step?: (
    component: Type.Step,
    index: string | number,
    root: Type.Job | Type.Step | Type.Step[]
  ) => void
}

export const visit_step = (
  step: Type.Step,
  visitor: StepVisitor,
  index?: string | number,
  root?: Type.Job | Type.Step | Type.Step[]
) => {
  if (is_step(step) && visitor.Step) visitor.Step(step, index, root)

  if (is_do_step(step)) {
    step.do.forEach((do_step, index) => visit_step(do_step, visitor, index, step.do))
  }

  if (is_in_parallel_step(step)) {
    const steps = Array.isArray(step.in_parallel)
      ? step.in_parallel
      : step.in_parallel.steps

    steps.forEach((in_parallel_step, index) => {
      visit_step(in_parallel_step, visitor, index, steps)
    })
  }

  if (is_try_step(step)) {
    visit_step(step.try, visitor, 'try', step)
  }

  if (step.on_abort) {
    visit_step(step.on_abort, visitor, 'on_abort', step)
  }

  if (step.on_error) {
    visit_step(step.on_error, visitor, 'on_error', step)
  }

  if (step.on_failure) {
    visit_step(step.on_failure, visitor, 'on_failure', step)
  }

  if (step.on_success) {
    visit_step(step.on_success, visitor, 'on_success', step)
  }

  if (step.ensure) {
    visit_step(step.ensure, visitor, 'ensure', step)
  }
}
