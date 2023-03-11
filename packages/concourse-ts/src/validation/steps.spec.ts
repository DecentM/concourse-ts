import test from 'ava'
import {Type} from '..'
import {Identifier} from '../utils'
import {ValidationWarning, ValidationWarningType} from '../utils/warning-store'

import {validate_steps} from './steps'

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
