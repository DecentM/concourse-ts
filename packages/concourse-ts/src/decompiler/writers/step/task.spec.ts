import test from 'ava'
import * as ts from 'typescript'

import {Type} from '../../..'
import {TaskStep} from '../../../components'
import {Identifier} from '../../../utils'

import {write_task_step} from './task'

const chain = (name: string, input: Type.TaskStep, pipeline: Type.Pipeline) => {
  const code = `
    import {TaskStep} from '../../../components'

    ${write_task_step(name, input, pipeline)}
  `

  const transpiled = ts.transpileModule(code, {
    reportDiagnostics: true,
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      strict: true,
    },
  })

  const result: TaskStep = eval(transpiled.outputText)

  return {
    result: result.serialise(),
    diagnostics: transpiled.diagnostics,
  }
}

const default_step = {
  attempts: undefined,
  ensure: undefined,
  on_abort: undefined,
  on_error: undefined,
  on_failure: undefined,
  on_success: undefined,
  tags: undefined,
  timeout: undefined,
}

const default_task_step = {
  ...default_step,
  config: undefined,
  task: 'a_task',
  vars: undefined,
  file: undefined,
  image: undefined,
  input_mapping: undefined,
  output_mapping: undefined,
  params: undefined,
  privileged: undefined,
}

const default_pipeline: Type.Pipeline = {
  jobs: [],
}

test('writes empty step', (t) => {
  const {result, diagnostics} = chain(
    'a',
    {task: 'at' as Identifier},
    default_pipeline
  )

  t.deepEqual(diagnostics, [])
  t.deepEqual(result, {
    ...default_task_step,
  })
})

test('writes file', (t) => {
  const {result, diagnostics} = chain(
    'a',
    {task: 'at' as Identifier, file: 'my-file.yml'},
    default_pipeline
  )

  t.deepEqual(diagnostics, [])
  t.deepEqual(result, {
    ...default_task_step,
    file: 'my-file.yml',
  })
})

test('writes image', (t) => {
  const {result, diagnostics} = chain(
    'a',
    {task: 'at' as Identifier, image: 'my-image' as Identifier},
    default_pipeline
  )

  t.deepEqual(diagnostics, [])
  t.deepEqual(result, {
    ...default_task_step,
    image: 'my-image',
  })
})

test('writes privileged', (t) => {
  const {result, diagnostics} = chain(
    'a',
    {task: 'at' as Identifier, privileged: true},
    default_pipeline
  )

  t.deepEqual(diagnostics, [])
  t.deepEqual(result, {
    ...default_task_step,
    privileged: true,
  })
})

test('writes vars', (t) => {
  const {result, diagnostics} = chain(
    'a',
    {task: 'at' as Identifier, vars: {my_var: '1'}},
    default_pipeline
  )

  t.deepEqual(diagnostics, [])
  t.deepEqual(result, {
    ...default_task_step,
    vars: {my_var: '1'},
  })
})

test('writes params', (t) => {
  const {result, diagnostics} = chain(
    'a',
    {task: 'at' as Identifier, params: {my_param: '1'}},
    default_pipeline
  )

  t.deepEqual(diagnostics, [])
  t.deepEqual(result, {
    ...default_task_step,
    params: {my_param: '1'},
  })
})

test('writes input_mapping', (t) => {
  const {result, diagnostics} = chain(
    'a',
    {
      task: 'at' as Identifier,
      input_mapping: {input: 'mapped'} as Record<Identifier, Identifier>,
    },
    default_pipeline
  )

  t.deepEqual(diagnostics, [])
  t.deepEqual(result, {
    ...default_task_step,
    input_mapping: {input: 'mapped'},
  })
})

test('writes output_mapping', (t) => {
  const {result, diagnostics} = chain(
    'a',
    {
      task: 'at' as Identifier,
      output_mapping: {output: 'mapped'} as Record<Identifier, Identifier>,
    },
    default_pipeline
  )

  t.deepEqual(diagnostics, [])
  t.deepEqual(result, {
    ...default_task_step,
    output_mapping: {output: 'mapped'},
  })
})
