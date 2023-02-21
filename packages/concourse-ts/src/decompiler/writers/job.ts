import {Job, Pipeline} from '../../declarations'
import {type_of} from '../../utils'

import {write_step} from './step'

export const write_job = (name: string, job: Job, pipeline: Pipeline) => {
  return `new Job(${JSON.stringify(name)}, (job) => {
    ${job.plan
      ?.map((step, index) => {
        return step
          ? `job.add_step(${write_step(
              `${name}_step-${index}`,
              step,
              pipeline
            )})`
          : ''
      })
      .join('\n')}

    ${
      type_of(job.build_log_retention) !== 'undefined'
        ? `job.build_log_retention = ${JSON.stringify(job.build_log_retention)}`
        : ''
    }

    ${
      type_of(job.disable_manual_trigger) !== 'undefined'
        ? `job.disable_manual_trigger = ${job.disable_manual_trigger}`
        : ''
    }

    ${
      type_of(job.interruptible) !== 'undefined'
        ? `job.interruptible = ${job.interruptible}`
        : ''
    }

    ${
      type_of(job.max_in_flight) !== 'undefined'
        ? `job.max_in_flight = ${job.max_in_flight}`
        : ''
    }

    ${
      type_of(job.old_name) !== 'undefined'
        ? `job.old_name = ${JSON.stringify(job.old_name)}`
        : ''
    }

    ${
      job.on_success
        ? `job.add_on_success(${write_step(
            `${name}_on_success`,
            job.on_success,
            pipeline
          )})`
        : ''
    }

    ${
      job.on_failure
        ? `job.add_on_failure(${write_step(
            `${name}_on_failure`,
            job.on_failure,
            pipeline
          )})`
        : ''
    }

    ${
      job.on_error
        ? `job.add_on_error(${write_step(
            `${name}_on_error`,
            job.on_error,
            pipeline
          )})`
        : ''
    }

    ${
      job.on_abort
        ? `job.add_on_abort(${write_step(
            `${name}_on_abort`,
            job.on_abort,
            pipeline
          )})`
        : ''
    }

    ${
      job.ensure
        ? `job.add_ensure(${write_step(
            `${name}_ensure`,
            job.ensure,
            pipeline
          )})`
        : ''
    }

    ${type_of(job.public) !== 'undefined' ? `job.public = ${job.public}` : ''}

    ${type_of(job.serial) !== 'undefined' ? `job.serial = ${job.serial}` : ''}

    ${
      type_of(job.serial_groups) !== 'undefined'
        ? `job.serial_groups = ${job.serial_groups}`
        : ''
    }
  })`
}
