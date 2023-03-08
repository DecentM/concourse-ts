import test from 'ava'
import * as ts from 'typescript'

import {Type} from '../..'
import {Command} from '../../components'

import {write_command} from './command'

const chain = (name: string, input: Type.Command) => {
  const code = write_command(name, input)
  const result = ts.transpile(code)
  const command: Command = eval(`
    const {Command} = require('../../components')
    ${result}
  `)

  return command.serialise()
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

  const result = chain('c', command)

  t.deepEqual(result, default_command)
})

test('writes args', (t) => {
  const command: Type.Command = {
    path: '',
    args: ['my_arg1', 'my_arg2'],
  }

  const result = chain('c', command)

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

  const result = chain('c', command)

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

  const result = chain('c', command)

  t.deepEqual(result, {
    ...default_command,
    ...command,
  })
})
