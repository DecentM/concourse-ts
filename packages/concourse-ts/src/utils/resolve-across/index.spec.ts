import test from 'ava'

import {Pipeline, Step} from '../../declarations'
import {Identifier} from '../identifier'

import {resolve_across_pipeline} from '.'
import {is_in_parallel_step} from '../step-type'

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
              args: ['alpine-((.:alpine))'],
            },
          },
        },
      ],
    },
  ],
})

test('creates the correct number of tasks', (t) => {
  const pipeline = create_pipeline()

  resolve_across_pipeline(pipeline)

  const step1 = pipeline.jobs[0].plan[0]

  if (!is_in_parallel_step(step1)) {
    t.fail('Did not create in_parallel step')
    return
  }

  t.is(step1.across, undefined)

  // Should create 2 * 3 steps because across[0].values.length * across[1].values.length
  t.is((step1.in_parallel as Step[]).length, 6)
})
