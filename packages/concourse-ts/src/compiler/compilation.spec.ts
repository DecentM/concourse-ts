import test from 'ava'

import { Pipeline } from '../components/index.js'
import {
  ValidationWarning,
  ValidationWarningType,
} from '../utils/warning-store/index.js'

import { Compilation } from './index.js'

import create_good_pipeline from './test-data/good.pipeline.js'

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
    result.pipeline.filename.endsWith('/a.yml'),
    'pipeline name does not end with "/a.yml"'
  )
})
