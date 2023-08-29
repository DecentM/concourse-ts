import test from 'ava'
import * as ConcourseTs from '@decentm/concourse-ts'

import { StepBuilder } from './step'

test('throws without a step type', (t) => {
  const builder = new StepBuilder()

  t.throws(
    () => {
      builder.build()
    },
    {
      name: 'VError',
      message: 'Cannot build step without a step type',
    }
  )
})

test('builds do step', (t) => {
  const builder = new StepBuilder().do((s) => {
    s.name('my-do-step')
  })

  const result = JSON.parse(JSON.stringify(builder.build().serialise()))

  t.deepEqual(result, {
    do: [],
  })
})

const r = new ConcourseTs.Resource('my-r', new ConcourseTs.ResourceType('my-rt'))

test('builds get step', (t) => {
  const builder = new StepBuilder().get((s) => {
    s.name('gs').get(r)
  })

  const result = JSON.parse(JSON.stringify(builder.build().serialise()))

  t.deepEqual(result, {
    get: 'my-r',
  })
})

test('builds put step', (t) => {
  const builder = new StepBuilder().put((s) => {
    s.name('gs').put(r)
  })

  const result = JSON.parse(JSON.stringify(builder.build().serialise()))

  t.deepEqual(result, {
    put: 'my-r',
  })
})

test('builds try step', (t) => {
  const builder = new StepBuilder().try((s) => {
    s.name('ts').try((ts) => {
      ts.do((ds) => {
        ds.name('my-do-step')
      })
    })
  })

  const result = JSON.parse(JSON.stringify(builder.build().serialise()))

  t.deepEqual(result, {
    try: {
      do: [],
    },
  })
})

test('builds set-pipeline step', (t) => {
  const builder = new StepBuilder().set_pipeline((s) => {
    s.file('pipeline.yml')
  })

  const result = JSON.parse(JSON.stringify(builder.build().serialise()))

  t.deepEqual(result, {
    file: 'pipeline.yml',
  })
})

test('builds in-parallel step', (t) => {
  const builder = new StepBuilder().in_parallel(() => {})

  const result = JSON.parse(JSON.stringify(builder.build().serialise()))

  t.deepEqual(result, {
    in_parallel: {
      steps: [],
    },
  })
})

test('builds load-var step', (t) => {
  const builder = new StepBuilder().load_var((s) => {
    s.load_var('my-var')
  })

  const result = JSON.parse(JSON.stringify(builder.build().serialise()))

  t.deepEqual(result, {
    load_var: 'my-var',
  })
})

test('builds task step', (t) => {
  const builder = new StepBuilder().task((s) => {
    s.file('my-task.yml').name('t')
  })

  const result = JSON.parse(JSON.stringify(builder.build().serialise()))

  t.deepEqual(result, {
    file: 'my-task.yml',
    task: 't_task',
  })
})
