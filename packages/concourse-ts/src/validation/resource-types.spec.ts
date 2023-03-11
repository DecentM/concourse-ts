import test from 'ava'
import {Identifier} from '../utils'
import {ValidationWarning, ValidationWarningType} from '../utils/warning-store'

import {validate_resource_types} from './resource-types'

test('allows empty resource types array', (t) => {
  const seen_types = {}
  const warnings = validate_resource_types(
    {
      jobs: [],
      resource_types: [],
    },
    seen_types
  )

  t.false(warnings.has_fatal())
  t.deepEqual(warnings.get_warnings(), [])
})

test('allows no resource types', (t) => {
  const seen_types = {}
  const warnings = validate_resource_types(
    {
      jobs: [],
    },
    seen_types
  )

  t.false(warnings.has_fatal())
  t.deepEqual(warnings.get_warnings(), [])
})

test("doesn't allow duplicate names", (t) => {
  const seen_types = {}
  const warnings = validate_resource_types(
    {
      jobs: [],
      resource_types: [
        {
          name: 'a' as Identifier,
          type: 'registry-image' as Identifier,
          source: {},
        },
        {
          name: 'a' as Identifier,
          type: 'registry-image' as Identifier,
          source: {},
        },
      ],
    },
    seen_types
  )

  t.true(warnings.has_fatal())
  t.deepEqual(warnings.get_warnings(), [
    new ValidationWarning({
      type: ValidationWarningType.Fatal,
      messages: ['Resource type 0 and 1 have the same name: "a"'],
    }),
  ])
})

test("doesn't allow resource types with no name", (t) => {
  const seen_types = {}
  const warnings = validate_resource_types(
    {
      jobs: [],
      resource_types: [
        {
          name: '' as Identifier,
          type: 'registry-image' as Identifier,
          source: {},
        },
      ],
    },
    seen_types
  )

  t.true(warnings.has_fatal())
  t.deepEqual(warnings.get_warnings(), [
    new ValidationWarning({
      type: ValidationWarningType.Fatal,
      messages: ['resource_types[0]: identifier cannot be an empty string'],
    }),
  ])
})

test("doesn't allow resource types with no type", (t) => {
  const seen_types = {}
  const warnings = validate_resource_types(
    {
      jobs: [],
      resource_types: [
        {
          name: 'my-resource' as Identifier,
          type: '' as Identifier,
          source: {},
        },
      ],
    },
    seen_types
  )

  t.true(warnings.has_fatal())
  t.deepEqual(warnings.get_warnings(), [
    new ValidationWarning({
      type: ValidationWarningType.Fatal,
      messages: ['Resource type "resource_types.my-resource" has no type'],
    }),
  ])
})

test('warns for not using registry-image', (t) => {
  const seen_types = {}
  const warnings = validate_resource_types(
    {
      jobs: [],
      resource_types: [
        {
          name: 'my-resource' as Identifier,
          type: 'git' as Identifier,
          source: {},
        },
      ],
    },
    seen_types
  )

  t.false(warnings.has_fatal())
  t.deepEqual(warnings.get_warnings(), [
    new ValidationWarning({
      type: ValidationWarningType.NonFatal,
      messages: [
        'Resource type "resource_types.my-resource" is not based on registry-image, some workers may be missing "git"',
      ],
    }),
  ])
})
