import test from 'ava'
import { Identifier } from '../utils/index.js'

import {
  ValidationWarning,
  ValidationWarningType,
} from '../utils/warning-store/index.js'

import { validate_groups } from './groups.js'

test('accepts valid input', (t) => {
  const warnings = validate_groups({
    jobs: [
      {
        name: 'job-a' as Identifier,
        plan: [],
      },
    ],
    groups: [
      {
        name: 'group-a' as Identifier,
        jobs: ['job-a' as Identifier],
      },
    ],
  })

  t.is(warnings.has_fatal(), false)
  t.deepEqual(warnings.get_warnings(), [])
})

test('accepts no groups', (t) => {
  const warnings = validate_groups({
    jobs: [
      {
        name: 'job-a' as Identifier,
        plan: [],
      },
    ],
  })

  t.is(warnings.has_fatal(), false)
  t.deepEqual(warnings.get_warnings(), [])
})

test('refuses duplicate group names', (t) => {
  const warnings = validate_groups({
    jobs: [
      {
        name: 'job-a' as Identifier,
        plan: [],
      },
    ],
    groups: [
      {
        name: 'group-a' as Identifier,
        jobs: ['job-a' as Identifier],
      },
      {
        name: 'group-a' as Identifier,
        jobs: ['job-a' as Identifier],
      },
    ],
  })

  t.is(warnings.has_fatal(), true)
  t.deepEqual(warnings.get_warnings(), [
    new ValidationWarning({
      type: ValidationWarningType.Fatal,
      messages: [
        'group "group-a" appears 2 times. Duplicate names are not allowed.',
      ],
    }),
  ])
})

test('refuses ungrouped jobs when groups are defined', (t) => {
  const warnings = validate_groups({
    jobs: [
      {
        name: 'job-a' as Identifier,
        plan: [],
      },
      {
        name: 'job-b' as Identifier,
        plan: [],
      },
    ],
    groups: [
      {
        name: 'group-a' as Identifier,
        jobs: ['job-a' as Identifier],
      },
      {
        name: 'group-b' as Identifier,
      },
      {
        name: 'group-c' as Identifier,
        jobs: [],
      },
    ],
  })

  t.is(warnings.has_fatal(), true)
  t.deepEqual(warnings.get_warnings(), [
    new ValidationWarning({
      type: ValidationWarningType.Fatal,
      messages: ['job "job-b" belongs to no group'],
    }),
  ])
})
