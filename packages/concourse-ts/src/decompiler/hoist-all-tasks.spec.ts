import test from 'ava'
import path from 'path'

import {Job, LoadVarStep, Pipeline, TaskStep} from '../components'

import {hoist_all_tasks} from './hoist-task'

test('hoists all tasks', (t) => {
  const pipeline = new Pipeline('p', (p) => {
    const ts = new TaskStep('a', (ts) => {
      ts.set_file('tasks/echo.yml')
    })

    const ntts = new TaskStep('b', (ts) => {
      ts.set_file('tasks/non-task.yml')
    })

    const ets = new TaskStep('c')

    p.add_job(
      new Job('pj', (pj) => {
        pj.add_step(ts)
        pj.add_step(ntts)
        pj.add_step(ets)
        pj.add_step(new LoadVarStep('lvs'))
      })
    )
  })

  const serialised = pipeline.serialise()

  const new_pipeline = hoist_all_tasks(path.join(__dirname, 'test'), serialised)

  t.deepEqual(new_pipeline, {
    display: undefined,
    groups: [],
    jobs: [
      {
        build_log_retention: undefined,
        build_logs_to_retain: undefined,
        disable_manual_trigger: undefined,
        ensure: undefined,
        interruptible: undefined,
        max_in_flight: undefined,
        name: 'pj',
        old_name: undefined,
        on_abort: undefined,
        on_error: undefined,
        on_failure: undefined,
        on_success: undefined,
        plan: [
          {
            attempts: undefined,
            config: {
              platform: 'linux',
              run: {
                args: ['Hello, world!'],
                path: 'echo',
              },
            },
            ensure: undefined,
            image: undefined,
            input_mapping: undefined,
            on_abort: undefined,
            on_error: undefined,
            on_failure: undefined,
            on_success: undefined,
            output_mapping: undefined,
            params: undefined,
            privileged: undefined,
            tags: [],
            task: 'a_task',
            timeout: undefined,
            vars: undefined,
          },
          {
            attempts: undefined,
            config: null,
            ensure: undefined,
            image: undefined,
            input_mapping: undefined,
            on_abort: undefined,
            on_error: undefined,
            on_failure: undefined,
            on_success: undefined,
            output_mapping: undefined,
            params: undefined,
            privileged: undefined,
            tags: [],
            task: 'b_task',
            timeout: undefined,
            vars: undefined,
          },
          {
            attempts: undefined,
            config: undefined,
            ensure: undefined,
            file: undefined,
            image: undefined,
            input_mapping: undefined,
            on_abort: undefined,
            on_error: undefined,
            on_failure: undefined,
            on_success: undefined,
            output_mapping: undefined,
            params: undefined,
            privileged: undefined,
            tags: [],
            task: 'c_task',
            timeout: undefined,
            vars: undefined,
          },
          {
            attempts: undefined,
            ensure: undefined,
            file: undefined,
            format: undefined,
            load_var: undefined,
            on_abort: undefined,
            on_error: undefined,
            on_failure: undefined,
            on_success: undefined,
            reveal: undefined,
            tags: [],
            timeout: undefined,
          },
        ],
        public: undefined,
        serial: undefined,
        serial_groups: [],
      },
    ],
    resource_types: [],
    resources: [],
    var_sources: [],
  })
})
