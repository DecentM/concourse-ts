import * as Type from '../../declarations/types'

const stepTypes = [
  'do',
  'get',
  'in_parallel',
  'load_var',
  'put',
  'set_pipeline',
  'task',
  'try',
] as const

export type StepType = (typeof stepTypes)[number]

export const get_step_type = (step: Type.Step): StepType => {
  return stepTypes.find((stepType) => stepType in step)
}

export const is_do_step = (step: Type.Step): step is Type.DoStep => {
  return !!step && get_step_type(step) === 'do'
}

export const is_get_step = (step: Type.Step): step is Type.GetStep => {
  return !!step && get_step_type(step) === 'get'
}

export const is_in_parallel_step = (
  step: Type.Step
): step is Type.InParallelStep => {
  return !!step && get_step_type(step) === 'in_parallel'
}

export const is_load_var_step = (step: Type.Step): step is Type.LoadVarStep => {
  return !!step && get_step_type(step) === 'load_var'
}

export const is_put_step = (step: Type.Step): step is Type.PutStep => {
  return !!step && get_step_type(step) === 'put'
}

export const is_set_pipeline_step = (
  step: Type.Step
): step is Type.SetPipelineStep => {
  return !!step && get_step_type(step) === 'set_pipeline'
}

export const is_task_step = (step: Type.Step): step is Type.TaskStep => {
  return !!step && get_step_type(step) === 'task'
}

export const is_try_step = (step: Type.Step): step is Type.TryStep => {
  return !!step && get_step_type(step) === 'try'
}
