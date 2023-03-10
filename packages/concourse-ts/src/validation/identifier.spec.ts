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
  const warnings1 = validate_identifier('!A', '.across', 'task')

  warnings.copy_from(warnings1)

  t.is(warnings.has_fatal(), false)
  t.deepEqual(warnings.get_warnings(), [])
})

test('rejects strings not starting with a lowercase letter', (t) => {
  const warnings = validate_identifier('A')

  t.is(warnings.has_fatal(), true)
  t.deepEqual(warnings.get_warnings(), [
    new ValidationWarning({
      type: ValidationWarningType.Fatal,
      messages: [
        '"A" is not a valid identifier: must start with a lowercase letter',
      ],
    }),
  ])
})

test('rejects strings with illegal characters', (t) => {
  const warnings = validate_identifier('a/')

  t.is(warnings.has_fatal(), true)
  t.deepEqual(warnings.get_warnings(), [
    new ValidationWarning({
      type: ValidationWarningType.Fatal,
      messages: ['"a/" is not a valid identifier: illegal character "/"'],
    }),
  ])
})
