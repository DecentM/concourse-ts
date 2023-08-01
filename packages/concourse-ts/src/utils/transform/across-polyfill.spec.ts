import test from 'ava'

import {
  InParallelConfig,
  InParallelStep,
  Pipeline,
  Step,
  TaskStep,
} from '../../declarations'
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
          task: 'running-with-node_((.:node))' as Identifier,
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

  t.assert('in_parallel' in step1)
  t.assert('steps' in step1.in_parallel)
  t.is(step1.across, undefined)

  // Should create 2 * 3 steps because across[0].values.length * across[1].values.length
  t.is(((step1.in_parallel as InParallelConfig).steps as Step[]).length, 6)
})

test('leaves non-across steps alone', (t) => {
  const pipeline = create_pipeline()
  const orig_pipeline = create_pipeline()

  pipeline.jobs[0].plan[0].across = undefined
  orig_pipeline.jobs[0].plan[0].across = undefined

  apply_across_polyfill(pipeline)

  t.deepEqual(pipeline, orig_pipeline)
})

test('rewrites task names', (t) => {
  const pipeline = create_pipeline()

  apply_across_polyfill(pipeline)

  const step = pipeline.jobs[0].plan[0] as InParallelStep
  const child_step = (step.in_parallel as InParallelConfig).steps[0] as TaskStep

  t.is(child_step.task, 'running-with-node_14' as Identifier)
})

test('avoids rewriting task names if the name is not a local variable', (t) => {
  const pipeline = create_pipeline()

  ;(pipeline.jobs[0].plan[0] as TaskStep).task =
    'running-with-node_((a:node))' as Identifier

  apply_across_polyfill(pipeline)

  const step = pipeline.jobs[0].plan[0] as InParallelStep
  const child_step = (step.in_parallel as InParallelConfig).steps[0] as TaskStep

  t.is(child_step.task, 'running-with-node_((a:node))' as Identifier)
})

test('replaces multiple variables in a single value', (t) => {
  const pipeline = create_pipeline()

  apply_across_polyfill(pipeline)

  const step = pipeline.jobs[0].plan[0] as InParallelStep
  const child_step = (step.in_parallel as InParallelConfig).steps[0] as TaskStep

  t.is(
    child_step.config!.run.args![0],
    'alpine 13.7 with node 14' as Identifier
  )
})

const step_with_across = {
  across: [
    {
      var: 'node',
      values: ['20'],
    },
  ],
  task: 'write_tags',
  config: {
    run: {
      args: ['node((.:node))'],
    },
  },
}

const polyfilled_step_with_across = {
  in_parallel: {
    fail_fast: true,
    limit: 1,
    steps: [
      {
        across: undefined,
        task: 'write_tags',
        config: {
          run: {
            args: [`node20`],
            path: undefined,
          },
        },
      },
    ],
  },
}

test('recurses into in_parallel steps', (t) => {
  const input = {
    jobs: [
      {
        name: 'build-cli',
        plan: [
          {
            in_parallel: {
              steps: [step_with_across],
            },
          },
        ],
      },
    ],
  } as Pipeline

  apply_across_polyfill(input)

  t.deepEqual(input, {
    jobs: [
      {
        name: 'build-cli',
        plan: [
          {
            in_parallel: {
              steps: [polyfilled_step_with_across],
            },
          },
        ],
      },
    ],
  })
})

test('recurses into in_parallel steps with shorthand config', (t) => {
  const input = {
    jobs: [
      {
        name: 'build-cli',
        plan: [
          {
            in_parallel: [step_with_across],
          },
        ],
      },
    ],
  } as Pipeline

  apply_across_polyfill(input)

  t.deepEqual(input, {
    jobs: [
      {
        name: 'build-cli',
        plan: [
          {
            in_parallel: [polyfilled_step_with_across],
          },
        ],
      },
    ],
  })
})

test('recurses into on_error', (t) => {
  const input = {
    jobs: [
      {
        name: 'a',
        plan: [
          {
            do: [],
            on_error: step_with_across,
          },
        ],
      },
    ],
  } as unknown as Pipeline

  apply_across_polyfill(input)

  t.deepEqual(input, {
    jobs: [
      {
        name: 'a',
        plan: [
          {
            do: [],
            on_error: polyfilled_step_with_across,
          },
        ],
      },
    ],
  })
})

test('recurses into on_success', (t) => {
  const input = {
    jobs: [
      {
        name: 'a',
        plan: [
          {
            do: [],
            on_success: step_with_across,
          },
        ],
      },
    ],
  } as unknown as Pipeline

  apply_across_polyfill(input)

  t.deepEqual(input, {
    jobs: [
      {
        name: 'a',
        plan: [
          {
            do: [],
            on_success: polyfilled_step_with_across,
          },
        ],
      },
    ],
  })
})

test('recurses into on_abort', (t) => {
  const input = {
    jobs: [
      {
        name: 'a',
        plan: [
          {
            do: [],
            on_abort: step_with_across,
          },
        ],
      },
    ],
  } as unknown as Pipeline

  apply_across_polyfill(input)

  t.deepEqual(input, {
    jobs: [
      {
        name: 'a',
        plan: [
          {
            do: [],
            on_abort: polyfilled_step_with_across,
          },
        ],
      },
    ],
  })
})

test('recurses into on_failure', (t) => {
  const input = {
    jobs: [
      {
        name: 'a',
        plan: [
          {
            do: [],
            on_failure: step_with_across,
          },
        ],
      },
    ],
  } as unknown as Pipeline

  apply_across_polyfill(input)

  t.deepEqual(input, {
    jobs: [
      {
        name: 'a',
        plan: [
          {
            do: [],
            on_failure: polyfilled_step_with_across,
          },
        ],
      },
    ],
  })
})

test('recurses into try steps', (t) => {
  const input = {
    jobs: [
      {
        name: 'a',
        plan: [
          {
            try: step_with_across,
          },
        ],
      },
    ],
  } as unknown as Pipeline

  apply_across_polyfill(input)

  t.deepEqual(input, {
    jobs: [
      {
        name: 'a',
        plan: [
          {
            try: polyfilled_step_with_across,
          },
        ],
      },
    ],
  })
})

test('recurses into do steps', (t) => {
  const input = {
    jobs: [
      {
        name: 'a',
        plan: [
          {
            do: [step_with_across],
          },
        ],
      },
    ],
  } as unknown as Pipeline

  apply_across_polyfill(input)

  t.deepEqual(input, {
    jobs: [
      {
        name: 'a',
        plan: [
          {
            do: [polyfilled_step_with_across],
          },
        ],
      },
    ],
  })
})

const step_with_nested_across = {
  across: [
    {
      var: 'node',
      values: ['20'],
    },
  ],
  do: [
    {
      task: 'write_tags',
      config: {
        run: {
          args: ['node((.:node))'],
        },
      },
    },
  ],
}

const polyfilled_step_with_nested_across = {
  in_parallel: {
    fail_fast: true,
    limit: 1,
    steps: [
      {
        across: undefined,
        do: [
          {
            task: 'write_tags',
            config: {
              run: {
                args: [`node20`],
                path: undefined,
              },
            },
          },
        ],
      },
    ],
  },
}

test('recurses for variables from a parent step', (t) => {
  const input = {
    jobs: [
      {
        name: 'a',
        plan: [step_with_nested_across],
      },
    ],
  } as unknown as Pipeline

  apply_across_polyfill(input)

  t.deepEqual(input, {
    jobs: [
      {
        name: 'a',
        plan: [polyfilled_step_with_nested_across],
      },
    ],
  })
})
