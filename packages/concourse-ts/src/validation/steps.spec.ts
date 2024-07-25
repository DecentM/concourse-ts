import test from 'ava'
import { Type } from '../index.js'
import { Identifier } from '../utils/index.js'
import {
  ValidationWarning,
  ValidationWarningType,
} from '../utils/warning-store/index.js'

import { validate_steps } from './steps.js'

test('validates jobs with no plan', (t) => {
  const warnings = validate_steps({
    jobs: [
      {
        name: 'aj' as Identifier,
        plan: [],
      },
    ],
  })

  t.false(warnings.has_fatal())
  t.deepEqual(warnings.get_warnings(), [])
})

test("doesn't allow aggregate steps", (t) => {
  const warnings = validate_steps({
    jobs: [
      {
        name: 'aj' as Identifier,
        plan: [
          {
            aggregate: {},
            do: [],
          } as Type.DoStep,
        ],
      },
    ],
  })

  t.true(warnings.has_fatal())
  t.deepEqual(warnings.get_warnings(), [
    new ValidationWarning({
      type: ValidationWarningType.Fatal,
      messages: [
        'Job "aj" contains an aggregate step. Replace the aggregate step with an in_parallel step to fix this.',
      ],
    }),
  ])
})
