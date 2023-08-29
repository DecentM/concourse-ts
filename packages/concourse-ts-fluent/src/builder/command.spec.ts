import test from 'ava'

import { CommandBuilder } from './command'

test('builds command', (t) => {
  const command = new CommandBuilder().dir('.').path('echo').arg('test').user('root')

  const result = JSON.parse(JSON.stringify(command.build()))

  t.deepEqual(result, {
    args: ['test'],
    dir: '.',
    path: 'echo',
    user: 'root',
  })
})
