import test from 'ava'
import {Type} from '..'
import {Identifier} from '../utils'
import {ValidationWarning, ValidationWarningType} from '../utils/warning-store'

import {validate_var_sources} from './var-sources'

test('validates no var_sources', (t) => {
  const warnings = validate_var_sources({
    jobs: [],
  })

  t.false(warnings.has_fatal())
  t.deepEqual(warnings.get_warnings(), [])
})

test('validates empty var_sources', (t) => {
  const warnings = validate_var_sources({
    jobs: [],
    var_sources: [],
  })

  t.false(warnings.has_fatal())
  t.deepEqual(warnings.get_warnings(), [])
})

test("doesn't allow duplicate names", (t) => {
  const warnings = validate_var_sources({
    jobs: [],
    var_sources: [
      {
        name: 'vsa' as Identifier,
        config: {
          vars: {},
        },
        type: 'dummy',
      },
      {
        name: 'vsa' as Identifier,
        config: {
          vars: {},
        },
        type: 'dummy',
      },
    ],
  })

  t.true(warnings.has_fatal())
  t.deepEqual(warnings.get_warnings(), [
    new ValidationWarning({
      type: ValidationWarningType.Fatal,
      messages: ['var_source 0 and 1 have the same name: "vsa"'],
    }),
  ])
})

test("doesn't allow unknown types", (t) => {
  const warnings = validate_var_sources({
    jobs: [],
    var_sources: [
      {
        name: 'vsa' as Identifier,
        config: {},
        type: 'AAAAAAAAAAAAAAA' as string,
      } as Type.VarSource,
    ],
  })

  t.true(warnings.has_fatal())
  t.deepEqual(warnings.get_warnings(), [
    new ValidationWarning({
      type: ValidationWarningType.Fatal,
      messages: [
        'credential manager type "AAAAAAAAAAAAAAA" is not supported in pipeline yet',
      ],
    }),
  ])
})

test('allows dummy type', (t) => {
  const warnings = validate_var_sources({
    jobs: [],
    var_sources: [
      {
        name: 'vsa' as Identifier,
        config: {
          vars: {},
        },
        type: 'dummy',
      },
    ],
  })

  t.false(warnings.has_fatal())
  t.deepEqual(warnings.get_warnings(), [])
})

test('allows vault type', (t) => {
  const warnings = validate_var_sources({
    jobs: [],
    var_sources: [
      {
        name: 'vsa' as Identifier,
        config: {
          url: '',
        },
        type: 'vault',
      },
    ],
  })

  t.false(warnings.has_fatal())
  t.deepEqual(warnings.get_warnings(), [])
})

test('allows secretsmanager type', (t) => {
  const warnings = validate_var_sources({
    jobs: [],
    var_sources: [
      {
        name: 'vsa' as Identifier,
        config: {},
        type: 'secretsmanager',
      },
    ],
  })

  t.false(warnings.has_fatal())
  t.deepEqual(warnings.get_warnings(), [])
})

test('allows ssm type', (t) => {
  const warnings = validate_var_sources({
    jobs: [],
    var_sources: [
      {
        name: 'vsa' as Identifier,
        config: {
          region: '',
        },
        type: 'ssm',
      },
    ],
  })

  t.false(warnings.has_fatal())
  t.deepEqual(warnings.get_warnings(), [])
})
