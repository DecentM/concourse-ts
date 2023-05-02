import test from 'ava'
import path from 'path'

import {TaskStep} from '../../components'

import {hoist_task} from '.'

test('hoists tasks', (t) => {
  const ts = new TaskStep('a', (ts) => {
    ts.set_file('tasks/echo.yml')
  })

  const serialised = ts.serialise()

  const task = hoist_task(path.join(__dirname, 'test-data'), serialised)

  t.deepEqual(task, {
    platform: 'linux',
    run: {
      path: 'echo',
      args: ['Hello, world!'],
    },
  })
})

test('returns null when task step has no file set', (t) => {
  const ts = new TaskStep('a')
  const serialised = ts.serialise()

  t.is(hoist_task(path.join(__dirname, 'test-data'), serialised), undefined)
})

test('throws when task file is invalid', (t) => {
  const ts = new TaskStep('a', (ts) => {
    ts.set_file('tasks/non-task.yml')
  })

  const serialised = ts.serialise()

  t.is(hoist_task(path.join(__dirname, 'test-data'), serialised), undefined)
})
