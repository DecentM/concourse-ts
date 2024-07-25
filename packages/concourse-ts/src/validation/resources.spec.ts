import test from 'ava'
import { Identifier } from '../utils/index.js'
import {
  ValidationWarning,
  ValidationWarningType,
} from '../utils/warning-store/index.js'

import { validate_resources } from './resources.js'

test('allows empty resources array', (t) => {
  const seen_types = {}
  const warnings = validate_resources(
    {
      jobs: [],
      resources: [],
    },
    seen_types
  )

  t.false(warnings.has_fatal())
  t.deepEqual(warnings.get_warnings(), [])
})

test('allows no resources', (t) => {
  const seen_types = {}
  const warnings = validate_resources(
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
  const warnings = validate_resources(
    {
      jobs: [],
      resources: [
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
      messages: ['Resource 0 and 1 have the same name: "a"'],
    }),
  ])
})

test("doesn't allow resources with no type", (t) => {
  const seen_types = {}
  const warnings = validate_resources(
    {
      jobs: [],
      resources: [
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
      messages: ['Resource "resources.my-resource" has no type'],
    }),
  ])
})
