import test from 'ava'
import { Pipeline } from '../declarations/index.js'
import { Identifier } from '../utils/index.js'

import {
  ValidationWarning,
  ValidationWarningType,
} from '../utils/warning-store/index.js'

import { validate_cycle } from './cycle.js'

test('passes with no cycle', (t) => {
  const warnings = validate_cycle({
    jobs: [
      {
        name: 'my-job' as Identifier,
        plan: [
          {
            get: 'asd' as Identifier,
          },
        ],
      },
      {
        name: 'my-job-1' as Identifier,
        plan: [
          {
            get: 'asd' as Identifier,
            passed: ['my-job' as Identifier],
          },
        ],
      },
    ],
  })

  t.is(warnings.has_fatal(), false)
  t.deepEqual(warnings.get_warnings(), [])
})

test('detects cycles', (t) => {
  const warnings = validate_cycle({
    jobs: [
      {
        name: 'my-job' as Identifier,
        plan: [
          {
            get: 'asd' as Identifier,
            passed: ['my-job-1' as Identifier],
          },
        ],
      },
      {
        name: 'my-job-1' as Identifier,
        plan: [
          {
            get: 'asd' as Identifier,
            passed: ['my-job' as Identifier],
          },
        ],
      },
    ],
  })

  t.is(warnings.has_fatal(), true)
  t.deepEqual(warnings.get_warnings(), [
    new ValidationWarning({
      type: ValidationWarningType.Fatal,
      messages: ['pipeline contains a cycle that starts at Job "my-job"'],
    }),
  ])
})

test('detects "passed" with non-existent jobs', (t) => {
  const warnings = validate_cycle({
    jobs: [
      {
        name: 'my-job' as Identifier,
        plan: [],
      },
      {
        name: 'my-job-1' as Identifier,
        plan: [
          {
            get: 'asd' as Identifier,
            passed: ['some-job' as Identifier],
          },
        ],
      },
    ],
  })

  t.is(warnings.has_fatal(), true)
  t.deepEqual(warnings.get_warnings(), [
    new ValidationWarning({
      type: ValidationWarningType.Fatal,
      messages: [
        'job "my-job-1" contains a step that relies on a non-existent job: "some-job"',
      ],
    }),
  ])
})

test('ignores pipelines with no jobs', (t) => {
  const warnings = validate_cycle({} as Pipeline)

  t.is(warnings.has_fatal(), false)
  t.deepEqual(warnings.get_warnings(), [])
})
