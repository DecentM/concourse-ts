import path from 'node:path'
import fs from 'node:fs/promises'

import test from 'ava'

import { Type } from '../../index.js'

import { write_command } from './command.js'
import { tsImport } from 'tsx/esm/api'

const chain = async (input: Type.Command) => {
  const code = `
    import {Command} from '../../components/index.js'

    export default ${write_command(input)}
  `

  const tmpDir = await fs.mkdtemp(path.join(import.meta.dirname))
  const tmpPath = path.join(tmpDir, 'step.ts')

  await fs.writeFile(tmpPath, code, 'utf-8')

  const loaded = await tsImport(tmpPath, import.meta.url)

  await fs.rm(tmpDir, { recursive: true, force: true })

  return { result: loaded.default, code }
}

const default_command = {
  path: '',
  args: [],
  dir: undefined,
  user: undefined,
}

test('writes empty command', async (t) => {
  const command: Type.Command = {
    path: '',
  }

  const { result } = await chain(command)

  t.deepEqual(result?.serialise(), default_command)
})

test('writes args', async (t) => {
  const command: Type.Command = {
    path: '',
    args: ['my_arg1', 'my_arg2'],
  }

  const { result } = await chain(command)

  t.deepEqual(result?.serialise(), {
    ...default_command,
    ...command,
  })
})

test('writes dir', async (t) => {
  const command: Type.Command = {
    path: '',
    dir: '.',
  }

  const { result } = await chain(command)

  t.deepEqual(result?.serialise(), {
    ...default_command,
    ...command,
  })
})

test('writes user', async (t) => {
  const command: Type.Command = {
    path: '',
    user: 'root',
  }

  const { result } = await chain(command)

  t.deepEqual(result?.serialise(), {
    ...default_command,
    ...command,
  })
})
