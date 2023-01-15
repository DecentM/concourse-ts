import test from 'ava'
import {Compilation} from './compilation'

import mainPipeline, {
  Group,
} from '../../examples/corpity-corp/dev/ci/index.pipeline'

test('compiles example pipeline with no warnings', (t) => {
  const compilation = new Compilation<Group>()

  compilation.set_input(mainPipeline())

  t.deepEqual(compilation.validate().get_warnings(), [])
})

test('does not compile without input', (t) => {
  const compilation = new Compilation()

  t.throws(() => compilation.compile(), {
    message: 'Cannot get result without input. Call set_input first!',
  })
})

test('does not validate without input', (t) => {
  const compilation = new Compilation()
  const warnings = compilation.validate()

  t.is(warnings.get_warnings().length, 1)
  t.is(
    warnings.get_warnings()[0].get_message(),
    'Pipeline is invalid. Expected an object, but got undefined'
  )
})
