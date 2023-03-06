import test from 'ava'

import {Command} from './command'

test.beforeEach(() => {
  Command.customise((command) => {
    command.user = 'root'
  })
})

test('runs static customiser', (t) => {
  const command = new Command('a')

  t.deepEqual(command.serialise(), {
    path: undefined,
    args: [],
    dir: undefined,
    user: 'root',
  })
})

test('runs instance customiser', (t) => {
  const command = new Command('a', (a) => {
    a.dir = '/a'
  })

  t.deepEqual(command.serialise(), {
    path: undefined,
    args: [],
    dir: '/a',
    user: 'root',
  })
})

test('stores args', (t) => {
  const command = new Command('a')

  command.add_arg('my-arg')

  t.deepEqual(command.serialise(), {
    path: undefined,
    args: ['my-arg'],
    dir: undefined,
    user: 'root',
  })
})
