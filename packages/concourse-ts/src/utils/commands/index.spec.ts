import test from 'ava'

import {join_commands} from '.'
import {Command} from '../../components'

test('joins commands', (t) => {
  const a = new Command('a', (a) => {
    a.path = 'echo'
    a.add_arg('Hello, world!')
  })

  const b = new Command('b', (a) => {
    a.path = 'echo'
    a.add_arg('mynames Jeff!')
  })

  const joined = join_commands(
    'joined',
    (args) => {
      return args.join(' && ')
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
  const a = new Command('a', (a) => {
    a.path = 'echo'
    a.add_arg('Hello, world!')
    a.add_arg('mynames Jeff!')
  })

  const joined = join_commands(
    'joined',
    (args) => {
      return args.join(' && ')
    },
    a
  )

  t.deepEqual(joined.serialise(), {
    path: undefined,
    args: ['echo "Hello, world!" "mynames Jeff!"'],
    dir: undefined,
    user: undefined,
  })
})
