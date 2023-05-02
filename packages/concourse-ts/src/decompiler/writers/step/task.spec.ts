import test from 'ava'
import * as ts from 'typescript'

import {Type} from '../../..'
import {TaskStep} from '../../../components'
import {Identifier} from '../../../utils'

import {write_task_step} from './task'
import {default_task_step} from '../../../components/step/test-data/default-steps'

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
    task: 'a_task',
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
    task: 'a_task',
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
    task: 'a_task',
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
    task: 'a_task',
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
    task: 'a_task',
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
    task: 'a_task',
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
    task: 'a_task',
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
    config: undefined,
    output_mapping: {output: 'mapped'},
    task: 'a_task',
  })
})
