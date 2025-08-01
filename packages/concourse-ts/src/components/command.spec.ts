import test from 'ava'

import { Command } from './command.js'

test.beforeEach(() => {
  Command.customise((command) => {
    command.user = 'root'
  })
})

test('runs static customiser', (t) => {
  const command = new Command()

  t.deepEqual(command.serialise(), {
    path: undefined,
    args: [],
    dir: undefined,
    user: 'root',
  })
})

test('runs instance customiser', (t) => {
  const command = new Command((a) => {
    a.set_dir('/a')
  })

  t.deepEqual(command.serialise(), {
    path: undefined,
    args: [],
    dir: '/a',
    user: 'root',
  })
})

test('stores args', (t) => {
  const command = new Command()

  command.add_args('my-arg')

  t.deepEqual(command.serialise(), {
    path: undefined,
    args: ['my-arg'],
    dir: undefined,
    user: 'root',
  })
})
