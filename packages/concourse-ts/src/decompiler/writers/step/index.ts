import { VError } from 'verror'
import { Pipeline, Step } from '../../../declarations/index.js'

import {
  is_do_step,
  is_get_step,
  is_in_parallel_step,
  is_load_var_step,
  is_put_step,
  is_set_pipeline_step,
  is_task_step,
  is_try_step,
} from '../../../utils/step-type'

import { write_do_step } from './do.js'
import { write_get_step } from './get.js'
import { write_in_parallel_step } from './in-parallel'
import { write_load_var_step } from './load-var'
import { write_put_step } from './put.js'
import { write_set_pipeline_step } from './set-pipeline'
import { write_task_step } from './task.js'
import { write_try_step } from './try.js'

export const write_step = (name: string, step: Step, pipeline: Pipeline): string => {
  if (is_do_step(step)) return write_do_step(name, step, pipeline)

  if (is_get_step(step)) return write_get_step(name, step, pipeline)

  if (is_in_parallel_step(step)) return write_in_parallel_step(name, step, pipeline)

  if (is_load_var_step(step)) return write_load_var_step(name, step, pipeline)

  if (is_put_step(step)) return write_put_step(name, step, pipeline)

  if (is_set_pipeline_step(step))
    return write_set_pipeline_step(name, step, pipeline)

  if (is_task_step(step)) return write_task_step(name, step, pipeline)

  if (is_try_step(step)) return write_try_step(name, step, pipeline)

  throw new VError(
    `Step "${name}" cannot be stringified to code as it's not a recognised type`
  )
}
