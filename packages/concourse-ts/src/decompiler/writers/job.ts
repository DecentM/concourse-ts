import {Job, Pipeline} from '../../declarations'
import {empty_string_or} from '../../utils/empty_string_or'

import {write_step} from './step'

export const write_job = (name: string, job: Job, pipeline: Pipeline) => {
  return `new Job(${JSON.stringify(name)}, (job) => {
    ${empty_string_or(job.plan, (plan) =>
      plan
        ?.map((step, index) => {
          return empty_string_or(
            step,
            (step) =>
              `job.add_step(${write_step(
                `${name}_step-${index}`,
                step,
                pipeline
              )})`
          )
        })
        .join('\n')
    )}

    ${empty_string_or(
      job.build_log_retention,
      () =>
        `job.build_log_retention = ${JSON.stringify(job.build_log_retention)}`
    )}

    ${empty_string_or(
      job.disable_manual_trigger,
      () => `job.disable_manual_trigger = ${job.disable_manual_trigger}`
    )}

    ${empty_string_or(
      job.interruptible,
      () => `job.interruptible = ${job.interruptible}`
    )}

    ${empty_string_or(
      job.max_in_flight,
      () => `job.max_in_flight = ${job.max_in_flight}`
    )}

    ${empty_string_or(
      job.old_name,
      () => `job.old_name = ${JSON.stringify(job.old_name)}`
    )}

    ${empty_string_or(
      job.on_success,
      (on_success) =>
        `job.add_on_success(${write_step(
          `${name}_on_success`,
          on_success,
          pipeline
        )})`
    )}

    ${empty_string_or(
      job.on_failure,
      (on_failure) =>
        `job.add_on_failure(${write_step(
          `${name}_on_failure`,
          on_failure,
          pipeline
        )})`
    )}

    ${empty_string_or(
      job.on_error,
      (on_error) =>
        `job.add_on_error(${write_step(
          `${name}_on_error`,
          on_error,
          pipeline
        )})`
    )}

    ${empty_string_or(
      job.on_abort,
      (on_abort) =>
        `job.add_on_abort(${write_step(
          `${name}_on_abort`,
          on_abort,
          pipeline
        )})`
    )}

    ${empty_string_or(
      job.ensure,
      (ensure) =>
        `job.add_ensure(${write_step(`${name}_ensure`, ensure, pipeline)})`
    )}

    ${empty_string_or(job.public, (is_public) => `job.public = ${is_public}`)}

    ${empty_string_or(
      job.serial_groups,
      (serial_groups) => `job.serial_groups = ${JSON.stringify(serial_groups)}`
    )}
  })`
}
