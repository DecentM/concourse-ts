import test from 'ava'
import {Pipeline} from '../../../../../components/pipeline'
import {Task} from '../../../../../components/task'
import {getType} from './use-compile'

test('gets pipeline', (t) => {
  const p = new Pipeline('asd')

  t.is(getType(p), 'pipeline')
})

test('gets task', (t) => {
  const ta = new Task('asd')

  t.is(getType(ta), 'task')
})

test('throws for anything else', (t) => {
  const a = null
  const b = undefined
  const c = 1
  const d = 'a'

  t.throws(() => getType(a as unknown as Pipeline), {
    message: `Input must be an object. Got null`,
  })

  t.throws(() => getType(b as unknown as Pipeline), {
    message: 'Input must be an object. Got undefined',
  })

  t.throws(() => getType(c as unknown as Pipeline), {
    message: 'Input must be an object. Got number',
  })

  t.throws(() => getType(d as unknown as Pipeline), {
    message: 'Input must be an object. Got string',
  })
})
