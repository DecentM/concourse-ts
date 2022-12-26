import test from 'ava'
import {ResourceType, Pipeline} from '../src'

test('does not serialise duplicate resource types', (t) => {
  const p = new Pipeline('my-pipeline')
  const rt = new ResourceType('my-rt')

  const r1 = rt.create_resource('r1')
  const r2 = rt.create_resource('r2')

  p.add_resource(r1)
  p.add_resource(r2)
})
