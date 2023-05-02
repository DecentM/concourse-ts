import test from 'ava'
import path from 'path'

import {Job, Pipeline, TaskStep} from '../components'

import {hoist_all_tasks} from './hoist-task'
import {
  default_job,
  default_task_step,
} from '../components/step/test-data/default-steps'

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
        ...default_job,
        name: 'pj',
        plan: [
          {
            ...default_task_step,
            config: {
              platform: 'linux',
              run: {
                args: ['Hello, world!'],
                path: 'echo',
              },
            },
            task: 'a_task',
          },
          {
            ...default_task_step,
            task: 'b_task',
          },
          {
            ...default_task_step,
            task: 'c_task',
          },
        ],
      },
    ],
    resource_types: [],
    resources: [],
    var_sources: [],
  })
})
