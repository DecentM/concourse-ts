import test from 'ava'
import * as ts from 'typescript'

import {Type} from '../../..'
import {TryStep} from '../../../components'
import {Identifier} from '../../../utils'

import {write_try_step} from './try'

const chain = (name: string, input: Type.TryStep, pipeline: Type.Pipeline) => {
  const code = `
    import {TryStep, LoadVarStep} from '../../../components'

    ${write_try_step(name, input, pipeline)}
  `

  const transpiled = ts.transpileModule(code, {
    reportDiagnostics: true,
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      strict: true,
    },
  })

  const result: TryStep = eval(transpiled.outputText)

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

const default_load_var_step = {
  ...default_step,
  file: undefined,
  format: undefined,
  load_var: undefined,
  reveal: undefined,
  tags: undefined,
}

const default_try_step = {
  ...default_step,
  try: undefined,
}

const default_pipeline: Type.Pipeline = {
  jobs: [],
}

test('writes step', (t) => {
  const {result, diagnostics} = chain(
    'a',
    {
      try: {
        load_var: 'a' as Identifier,
        file: 'my-file',
      },
    },
    default_pipeline
  )

  t.deepEqual(diagnostics, [])
  t.deepEqual(result, {
    ...default_try_step,
    try: {
      ...default_load_var_step,
      load_var: 'a',
      file: 'my-file',
    },
  })
})
