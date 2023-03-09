import test from 'ava'
import * as ts from 'typescript'

import {Type} from '../../..'
import {DoStep} from '../../../components'

import {write_do_step} from './do'

const chain = (name: string, input: Type.DoStep, pipeline: Type.Pipeline) => {
  const code = `
    import {DoStep} from '../../../components'

    ${write_do_step(name, input, pipeline)}
  `

  const transpiled = ts.transpileModule(code, {
    reportDiagnostics: true,
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      strict: true,
    },
  })

  const result: DoStep = eval(transpiled.outputText)

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
  tags: [],
  timeout: undefined,
}

const default_do_step = {
  ...default_step,
  do: [],
}

const default_pipeline: Type.Pipeline = {
  jobs: [],
}

test('writes empty step', (t) => {
  const {result, diagnostics} = chain('a', {do: []}, default_pipeline)

  t.deepEqual(diagnostics, [])
  t.deepEqual(result, default_do_step)
})

test('writes steps', (t) => {
  const {result, diagnostics} = chain(
    'a',
    {do: [default_do_step]},
    default_pipeline
  )

  t.deepEqual(diagnostics, [])
  t.deepEqual(result, {...default_do_step, do: [default_do_step]})
})
