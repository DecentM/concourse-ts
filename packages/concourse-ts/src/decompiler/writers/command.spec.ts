import test from 'ava'
import * as ts from 'typescript'

import {Type} from '../..'
import {Command} from '../../components'

import {write_command} from './command'

const chain = (name: string, input: Type.Command) => {
  const code = `
    import {Command} from '../../components'

    ${write_command(name, input)}
  `

  const result = ts.transpileModule(code, {
    reportDiagnostics: true,
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      strict: true,
    },
  })

  const job: Command = eval(result.outputText)

  return {
    result: job.serialise(),
    diagnostics: result.diagnostics,
  }
}

const default_command = {
  path: '',
  args: [],
  dir: undefined,
  user: undefined,
}

test('writes empty command', (t) => {
  const command: Type.Command = {
    path: '',
  }

  const {result, diagnostics} = chain('c', command)

  t.deepEqual(diagnostics, [])
  t.deepEqual(result, default_command)
})

test('writes args', (t) => {
  const command: Type.Command = {
    path: '',
    args: ['my_arg1', 'my_arg2'],
  }

  const {result, diagnostics} = chain('c', command)

  t.deepEqual(diagnostics, [])
  t.deepEqual(result, {
    ...default_command,
    ...command,
  })
})

test('writes dir', (t) => {
  const command: Type.Command = {
    path: '',
    dir: '.',
  }

  const {result, diagnostics} = chain('c', command)

  t.deepEqual(diagnostics, [])
  t.deepEqual(result, {
    ...default_command,
    ...command,
  })
})

test('writes user', (t) => {
  const command: Type.Command = {
    path: '',
    user: 'root',
  }

  const {result, diagnostics} = chain('c', command)

  t.deepEqual(diagnostics, [])
  t.deepEqual(result, {
    ...default_command,
    ...command,
  })
})
