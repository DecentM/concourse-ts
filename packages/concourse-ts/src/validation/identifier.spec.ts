import test from 'ava'

import {ValidationWarning, ValidationWarningType} from '../utils/warning-store'

import {validate_identifier} from './identifier'

test('accepts valid identifiers', (t) => {
  const warnings = validate_identifier('asd')

  t.is(warnings.has_fatal(), false)
  t.deepEqual(warnings.get_warnings(), [])
})

test('rejects empty strings', (t) => {
  const warnings = validate_identifier('')

  t.is(warnings.has_fatal(), true)
  t.deepEqual(warnings.get_warnings(), [
    new ValidationWarning({
      type: ValidationWarningType.Fatal,
      messages: ['identifier cannot be an empty string'],
    }),
  ])
})

test("accepts any string if we're inside an across step", (t) => {
  const warnings = validate_identifier('!A', 'across', 'set_pipeline')

  t.is(warnings.has_fatal(), false)
  t.deepEqual(warnings.get_warnings(), [])
})
