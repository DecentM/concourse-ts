import test from 'ava'

import {Pipeline} from '../components'
import {ValidationWarning, ValidationWarningType} from '../utils/warning-store'

import {Compilation} from '.'

import create_good_pipeline from './test-data/good.pipeline'

test('does not allow non-pipeline inputs', (t) => {
  const compilation = new Compilation()

  const warnings = compilation.validate({} as Pipeline)

  t.deepEqual(warnings.get_warnings(), [
    new ValidationWarning({
      type: ValidationWarningType.Fatal,
      messages: ['Input is not a pipeline'],
    }),
  ])
})

test('compiles valid pipeline', (t) => {
  const compilation = new Compilation()

  const result = compilation.compile(create_good_pipeline())

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

  const result = compilation.compile(create_good_pipeline())

  t.deepEqual(result.warnings.get_warnings(), [])
  t.is(result.tasks.length, 1)
})
