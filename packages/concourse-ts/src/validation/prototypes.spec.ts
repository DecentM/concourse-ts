import test from 'ava'
import { Type } from '../index.js'
import {
  ValidationWarning,
  ValidationWarningType,
} from '../utils/warning-store/index.js'

import { validate_prototypes } from './prototypes.js'

test('ignores pipelines without prototypes', (t) => {
  const warnings = validate_prototypes({
    jobs: [],
  })

  t.false(warnings.has_fatal())
  t.deepEqual(warnings.get_warnings(), [])
})

test('does not allow prototypes', (t) => {
  const warnings = validate_prototypes({
    jobs: [],
    prototypes: {},
  } as Type.Pipeline)

  t.true(warnings.has_fatal())
  t.deepEqual(warnings.get_warnings(), [
    new ValidationWarning({
      type: ValidationWarningType.Fatal,
      messages: ['concourse-ts does not support prototypes yet'],
    }),
  ])
})
