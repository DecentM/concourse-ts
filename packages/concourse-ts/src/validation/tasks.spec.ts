import test from 'ava'

import {Identifier} from '../utils'
import {ValidationWarning, ValidationWarningType} from '../utils/warning-store'

import {validate_tasks} from './tasks'

test('validates jobs with no plan', (t) => {
  const warnings = validate_tasks({
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

test('warns for tasks with image_resource on non-linux', (t) => {
  const warnings = validate_tasks({
    jobs: [
      {
        name: 'aj' as Identifier,
        plan: [
          {
            do: [],
          },
          {
            task: 'at' as Identifier,
            config: {
              image_resource: {
                type: 'registry-image' as Identifier,
                source: {},
              },
              platform: 'darwin',
              run: {
                path: 'echo',
                args: ['Hi!'],
              },
            },
          },
        ],
      },
    ],
  })

  t.false(warnings.has_fatal())
  t.deepEqual(warnings.get_warnings(), [
    new ValidationWarning({
      type: ValidationWarningType.NonFatal,
      messages: [
        'Image resources are ignored on "darwin", they\'re only used on "linux"',
      ],
    }),
  ])
})
