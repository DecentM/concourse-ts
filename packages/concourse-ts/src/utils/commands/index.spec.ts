import test from 'ava'

import { join_commands } from './index.js'
import { Command } from '../../components/index.js'

test('joins commands', (t) => {
  const a = new Command((a) => {
    a.path = 'echo'
    a.add_arg('Hello, world!')
  })

  const b = new Command((a) => {
    a.path = 'echo'
    a.add_arg('mynames Jeff!')
  })

  const joined = join_commands(
    (args, command) => {
      command.add_arg(args.join(' && '))
    },
    a,
    b
  )

  t.deepEqual(joined.serialise(), {
    path: undefined,
    args: ['echo "Hello, world!" && echo "mynames Jeff!"'],
    dir: undefined,
    user: undefined,
  })
})

test('joins commands with multiple arguments', (t) => {
  const a = new Command((a) => {
    a.path = 'echo'
    a.add_arg('Hello, world!')
    a.add_arg('mynames Jeff!')
  })

  const joined = join_commands((args, command) => {
    command.add_arg(args.join(' && '))
  }, a)

  t.deepEqual(joined.serialise(), {
    path: undefined,
    args: ['echo "Hello, world!" "mynames Jeff!"'],
    dir: undefined,
    user: undefined,
  })
})

test('copies dir', (t) => {
  const a = new Command((a) => {
    a.path = 'echo'
    a.dir = '/app'
    a.add_arg('Hello, world!')
  })

  const joined = join_commands((args, command) => {
    command.add_arg(args.join(' && '))
  }, a)

  t.deepEqual(joined.serialise(), {
    path: undefined,
    args: ['echo "Hello, world!"'],
    dir: '/app',
    user: undefined,
  })
})

test('copies user', (t) => {
  const a = new Command((a) => {
    a.path = 'echo'
    a.user = '1000'
    a.add_arg('Hello, world!')
  })

  const joined = join_commands((args, command) => {
    command.add_arg(args.join(' && '))
  }, a)

  t.deepEqual(joined.serialise(), {
    path: undefined,
    args: ['echo "Hello, world!"'],
    dir: undefined,
    user: '1000',
  })
})
