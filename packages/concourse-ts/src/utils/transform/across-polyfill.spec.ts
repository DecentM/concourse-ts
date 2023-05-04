import test from 'ava'

import {InParallelStep, Pipeline, Step, TaskStep} from '../../declarations'
import {Identifier} from '../../utils/identifier'

import {apply_across_polyfill} from './across-polyfill'

const create_pipeline = (): Pipeline => ({
  jobs: [
    {
      name: 'my-job' as Identifier,
      plan: [
        {
          across: [
            {
              var: 'node' as Identifier,
              values: ['14', '16', '18'],
            },
            {
              var: 'alpine' as Identifier,
              values: ['13.7', '13.4'],
            },
          ],
          task: 'running-with-node-((.:node))' as Identifier,
          config: {
            platform: 'linux',
            image_resource: {
              type: 'mock' as Identifier,
              source: {
                mirror_self: true,
              },
            },
            run: {
              path: 'echo',
              args: ['alpine ((.:alpine)) with node ((.:node))'],
            },
          },
        },
      ],
    },
  ],
})

test('creates the correct number of tasks', (t) => {
  const pipeline = create_pipeline()

  apply_across_polyfill(pipeline)

  const step1 = pipeline.jobs[0].plan[0] as InParallelStep

  t.is(step1.across, undefined)

  // Should create 2 * 3 steps because across[0].values.length * across[1].values.length
  t.is((step1.in_parallel as Step[]).length, 6)
})

test('leaves non-across steps alone', (t) => {
  const pipeline = create_pipeline()
  const orig_pipeline = create_pipeline()

  pipeline.jobs[0].plan[0].across = undefined
  orig_pipeline.jobs[0].plan[0].across = undefined

  apply_across_polyfill(pipeline)

  t.deepEqual(pipeline, orig_pipeline)
})

test('only changes variables that are defined in the matrix', (t) => {
  const pipeline = create_pipeline()

  pipeline.jobs[0].plan[0].across![0].var = 'something-else' as Identifier

  apply_across_polyfill(pipeline)

  const step = pipeline.jobs[0].plan[0] as InParallelStep
  const child_step = step.in_parallel[0] as TaskStep

  t.is(child_step.task, 'running-with-node-((.:node))' as Identifier)
})

test('replaces multiple variables in a single value', (t) => {
  const pipeline = create_pipeline()

  apply_across_polyfill(pipeline)

  const step = pipeline.jobs[0].plan[0] as InParallelStep
  const child_step = step.in_parallel[0] as TaskStep

  t.is(
    child_step.config!.run.args![0],
    'alpine ((my-job_step_0_across_0:alpine)) with node ((my-job_step_0_across_0:node))' as Identifier
  )
})
