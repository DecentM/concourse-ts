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

export const get_step_type = (step: unknown): StepType | null => {
  if (typeof step !== 'object') {
    return null
  }

  return stepTypes.find((stepType) => stepType in step) ?? null
}

export const is_step = (input: unknown): input is Type.Step => {
  return !!get_step_type(input)
}

export const is_do_step = (step: Type.Step): step is Type.DoStep => {
  return get_step_type(step) === 'do'
}

export const is_get_step = (step: Type.Step): step is Type.GetStep => {
  return get_step_type(step) === 'get'
}

export const is_in_parallel_step = (
  step: Type.Step
): step is Type.InParallelStep => {
  return get_step_type(step) === 'in_parallel'
}

export const is_load_var_step = (step: Type.Step): step is Type.LoadVarStep => {
  return get_step_type(step) === 'load_var'
}

export const is_put_step = (step: Type.Step): step is Type.PutStep => {
  return get_step_type(step) === 'put'
}

export const is_set_pipeline_step = (
  step: Type.Step
): step is Type.SetPipelineStep => {
  return get_step_type(step) === 'set_pipeline'
}

export const is_task_step = (step: Type.Step): step is Type.TaskStep => {
  return get_step_type(step) === 'task'
}

export const is_try_step = (step: Type.Step): step is Type.TryStep => {
  return get_step_type(step) === 'try'
}
