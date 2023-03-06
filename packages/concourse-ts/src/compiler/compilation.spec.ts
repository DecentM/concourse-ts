import test from 'ava'

import {Pipeline} from '../components'
import {ValidationWarning, ValidationWarningType} from '../utils/warning-store'

import {Compilation} from './compilation'

import create_good_pipeline from './test-data/good.pipeline'

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
    warnings.get_warnings()[0].messages.join(', '),
    'Pipeline is invalid. Expected an object, but got undefined'
  )
})

test('does not allow setting the input multiple times', (t) => {
  const compilation = new Compilation()

  compilation.set_input(new Pipeline('asd'))

  t.throws(() => {
    compilation.set_input(new Pipeline('qwe'))
  })
})

test('does not allow non-pipeline inputs', (t) => {
  const compilation = new Compilation()

  compilation.set_input({} as Pipeline)

  const warnings = compilation.validate()

  t.deepEqual(warnings.get_warnings(), [
    new ValidationWarning({
      type: ValidationWarningType.Fatal,
      messages: ['Input is not a pipeline'],
    }),
  ])
})

test('compiles valid pipeline', (t) => {
  const compilation = new Compilation()

  compilation.set_input(create_good_pipeline())

  const result = compilation.compile()

  t.deepEqual(result.warnings.get_warnings(), [])
  t.assert(
    result.pipeline.filepath.endsWith('/a.yml'),
    'pipeline name does not end with "/a.yml"'
  )
})

test('extracts tasks', (t) => {
  const compilation = new Compilation({
    extract_tasks: true,
  })

  compilation.set_input(create_good_pipeline())

  const result = compilation.compile()

  t.deepEqual(result.warnings.get_warnings(), [])
  t.is(result.tasks.length, 1)
})
