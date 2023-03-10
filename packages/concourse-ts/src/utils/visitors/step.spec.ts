import test from 'ava'
import {Type} from '../..'
import {Identifier} from '../identifier'

import {StepVisitor, visit_step} from './step'

const steps: Type.Step[] = [
  {
    do: [],
  },
  {
    get: 'aa' as Identifier,
  },
  {
    in_parallel: [],
  },
  {
    load_var: 'av' as Identifier,
    file: 'f',
  },
  {
    put: 'aa' as Identifier,
  },
  {
    set_pipeline: 'self',
    file: 'f',
  },
  {
    task: 't0' as Identifier,
  },
  {
    task: 't1' as Identifier,
    config: {
      image_resource: {
        source: {},
        type: 'registry-image' as Identifier,
      },
      platform: 'linux',
      run: {
        path: 'echo',
        args: ['Hi'],
      },
    },
  },
  {
    try: {
      do: [],
    },
  },
]

const test_cases: Array<({count}: {count: number}) => StepVisitor> = [
  (ctx) => ({
    DoStep() {
      ctx.count++
    },
  }),

  (ctx) => ({
    GetStep() {
      ctx.count++
    },
  }),

  (ctx) => ({
    InParallelStep() {
      ctx.count++
    },
  }),

  (ctx) => ({
    LoadVarStep() {
      ctx.count++
    },
  }),

  (ctx) => ({
    PutStep() {
      ctx.count++
    },
  }),

  (ctx) => ({
    SetPipelineStep() {
      ctx.count++
    },
  }),

  (ctx) => ({
    TaskStep() {
      ctx.count++
    },
  }),

  (ctx) => ({
    Task() {
      ctx.count++
    },
  }),

  (ctx) => ({
    TryStep() {
      ctx.count++
    },
  }),
]

test_cases.forEach((test_case, index) => {
  const ctx = {
    count: 0,
  }

  const visitor = test_case(ctx)

  test(`finds ${Object.keys(visitor)[0]}s`, (t) => {
    visit_step(steps[index], visitor)

    t.is(ctx.count, 1)
  })
})

const step: Type.DoStep = {
  do: [],
  on_abort: {
    do: [],
  },
  on_error: {
    do: [],
  },
  on_failure: {
    do: [],
  },
  on_success: {
    do: [],
  },
  ensure: {
    do: [],
  },
}

test('recurses into hooks', (t) => {
  let count = 0

  visit_step(step, {
    DoStep() {
      count++
    },
    OnAbort() {
      count++
    },
    OnError() {
      count++
    },
    OnFailure() {
      count++
    },
    OnSuccess() {
      count++
    },
    Ensure() {
      count++
    },
  })

  t.is(count, 11)
})
