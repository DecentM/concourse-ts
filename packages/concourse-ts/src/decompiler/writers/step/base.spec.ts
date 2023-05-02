import test from 'ava'
import * as ts from 'typescript'

import {Type} from '../../..'
import {Platform} from '../../../declarations'
import {Duration, Identifier} from '../../../utils'

import {write_step_base} from './base'

const chain = (name: string, input: Type.Step, pipeline: Type.Pipeline) => {
  const code = write_step_base('step', name, input, pipeline)

  const transpiled = ts.transpileModule(code, {
    reportDiagnostics: true,
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      strict: true,
    },
  })

  return {
    diagnostics: transpiled.diagnostics,
    code: transpiled.outputText,
  }
}

const default_step = {
  task: 'ajt' as Identifier,
  config: {
    platform: 'linux' as Platform,
    image_resource: {
      type: 'registry-image' as Identifier,
      source: {},
    },
    run: {
      path: 'echo',
      args: [],
    },
  },
}

const default_pipeline: Type.Pipeline = {
  jobs: [
    {
      name: 'aj' as Identifier,
      plan: [],
    },
  ],
}

test('writes empty step modifiers', (t) => {
  const {diagnostics} = chain('a', default_step, default_pipeline)

  t.deepEqual(diagnostics, [])
})

test('writes attempts', (t) => {
  const {diagnostics, code} = chain(
    'a',
    {...default_step, attempts: 5},
    default_pipeline
  )

  t.deepEqual(diagnostics, [])
  t.assert(code.includes('attempts = 5'))
})

test('writes tags', (t) => {
  const {diagnostics, code} = chain(
    'a',
    {...default_step, tags: ['tag-a', 'tag-b']},
    default_pipeline
  )

  t.deepEqual(diagnostics, [])
  t.assert(code.includes('step.add_tag("tag-a", "tag-b")'))
})

test('writes timeout', (t) => {
  const {diagnostics, code} = chain(
    'a',
    {...default_step, timeout: '1h2m' as Duration},
    default_pipeline
  )

  t.deepEqual(diagnostics, [])
  t.assert(code.includes('step.set_timeout({ "hours": 1, "minutes": 2 })'))
})

test('writes across', (t) => {
  const {diagnostics, code} = chain(
    'a',
    {
      ...default_step,
      across: [
        {
          values: ['value-a', 'value-b'],
          var: 'my-var' as Identifier,
          fail_fast: true,
          max_in_flight: 2,
        },
      ],
    },
    default_pipeline
  )

  t.deepEqual(diagnostics, [])
  t.assert(
    code.includes(
      'step.add_across({ "values": ["value-a", "value-b"], "var": "my-var", "fail_fast": true, "max_in_flight": 2 })'
    )
  )
})

test('writes ensure', (t) => {
  const {diagnostics, code} = chain(
    'a',
    {...default_step, ensure: default_step},
    default_pipeline
  )

  t.deepEqual(diagnostics, [])
  t.assert(code.includes('step.add_ensure(new TaskStep'))
})

test('writes on_success', (t) => {
  const {diagnostics, code} = chain(
    'a',
    {...default_step, on_success: default_step},
    default_pipeline
  )

  t.deepEqual(diagnostics, [])
  t.assert(code.includes('step.add_on_success(new TaskStep'))
})

test('writes on_error', (t) => {
  const {diagnostics, code} = chain(
    'a',
    {...default_step, on_error: default_step},
    default_pipeline
  )

  t.deepEqual(diagnostics, [])
  t.assert(code.includes('step.add_on_error(new TaskStep'))
})

test('writes on_failure', (t) => {
  const {diagnostics, code} = chain(
    'a',
    {...default_step, on_failure: default_step},
    default_pipeline
  )

  t.deepEqual(diagnostics, [])
  t.assert(code.includes('step.add_on_failure(new TaskStep'))
})

test('writes on_abort', (t) => {
  const {diagnostics, code} = chain(
    'a',
    {...default_step, on_abort: default_step},
    default_pipeline
  )

  t.deepEqual(diagnostics, [])
  t.assert(code.includes('step.add_on_abort(new TaskStep'))
})
