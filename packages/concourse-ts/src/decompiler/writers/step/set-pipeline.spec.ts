import test from 'ava'
import * as ts from 'typescript'

import {Type} from '../../..'
import {SetPipelineStep} from '../../../components'
import {Identifier} from '../../../utils'

import {write_set_pipeline_step} from './set-pipeline'

const chain = (
  name: string,
  input: Type.SetPipelineStep,
  pipeline: Type.Pipeline
) => {
  const code = `
    import {SetPipelineStep} from '../../../components'

    ${write_set_pipeline_step(name, input, pipeline)}
  `

  const transpiled = ts.transpileModule(code, {
    reportDiagnostics: true,
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      strict: true,
    },
  })

  const result: SetPipelineStep = eval(transpiled.outputText)

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

const default_set_pipeline_step = {
  ...default_step,
  team: undefined,
  var_files: undefined,
  vars: undefined,
  set_pipeline: undefined,
  file: undefined,
  instance_vars: undefined,
}

const default_pipeline: Type.Pipeline = {
  jobs: [],
}

test('writes empty step', (t) => {
  const {result, diagnostics} = chain(
    'a',
    {set_pipeline: 'self', file: 'my-file'},
    default_pipeline
  )

  t.deepEqual(diagnostics, [])
  t.deepEqual(result, {
    ...default_set_pipeline_step,
    file: 'my-file',
    set_pipeline: 'self',
  })
})

test('writes instance_vars', (t) => {
  const {result, diagnostics} = chain(
    'a',
    {set_pipeline: 'self', file: 'my-file', instance_vars: {my_var: '1'}},
    default_pipeline
  )

  t.deepEqual(diagnostics, [])
  t.deepEqual(result, {
    ...default_set_pipeline_step,
    file: 'my-file',
    set_pipeline: 'self',
    instance_vars: {my_var: '1'},
  })
})

test('writes vars', (t) => {
  const {result, diagnostics} = chain(
    'a',
    {set_pipeline: 'self', file: 'my-file', vars: {my_var: '1'}},
    default_pipeline
  )

  t.deepEqual(diagnostics, [])
  t.deepEqual(result, {
    ...default_set_pipeline_step,
    file: 'my-file',
    set_pipeline: 'self',
    vars: {my_var: '1'},
  })
})

test('writes var_files', (t) => {
  const {result, diagnostics} = chain(
    'a',
    {set_pipeline: 'self', file: 'my-file', var_files: ['file-a', 'file-b']},
    default_pipeline
  )

  t.deepEqual(diagnostics, [])
  t.deepEqual(result, {
    ...default_set_pipeline_step,
    file: 'my-file',
    set_pipeline: 'self',
    var_files: ['file-a', 'file-b'],
  })
})

test('writes team', (t) => {
  const {result, diagnostics} = chain(
    'a',
    {set_pipeline: 'self', file: 'my-file', team: 'my-team' as Identifier},
    default_pipeline
  )

  t.deepEqual(diagnostics, [])
  t.deepEqual(result, {
    ...default_set_pipeline_step,
    file: 'my-file',
    set_pipeline: 'self',
    team: 'my-team',
  })
})
