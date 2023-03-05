import test from 'ava'
import {Pipeline} from '../../declarations'
import {Identifier} from '../../utils'

import {
  ValidationWarning,
  ValidationWarningType,
} from '../../utils/warning-store'

import {validate_cycle} from './cycle'

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

test('ignores pipelines with no jobs', (t) => {
  const warnings = validate_cycle({} as Pipeline)

  t.is(warnings.has_fatal(), false)
  t.deepEqual(warnings.get_warnings(), [])
})
