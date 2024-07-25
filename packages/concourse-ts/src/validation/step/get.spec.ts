import test from 'ava'

import { Identifier } from '../../utils/index.js'
import {
  ValidationWarning,
  ValidationWarningType,
} from '../../utils/warning-store/index.js'

import { validate_get_steps } from './get.js'

test('validates happy path', (t) => {
  const warnings = validate_get_steps({
    jobs: [
      {
        name: 'j0' as Identifier,
        plan: [
          {
            get: 'r' as Identifier,
          },
        ],
      },
      {
        name: 'j1' as Identifier,
        plan: [
          {
            put: 'r' as Identifier,
          },
        ],
      },
      {
        name: 'j2' as Identifier,
        plan: [
          {
            get: 'r' as Identifier,
            passed: ['j0', 'j1'] as Identifier[],
          },
        ],
      },
    ],
    resources: [
      {
        name: 'r' as Identifier,
        type: 'registry-image' as Identifier,
        source: {
          repository: 'alpine',
          tag: 'latest',
        },
      },
    ],
  })

  t.false(warnings.has_fatal())
  t.deepEqual(warnings.get_warnings(), [])
})

test('does not allow "passed" when a job doesn\'t interact with it', (t) => {
  const warnings = validate_get_steps({
    jobs: [
      {
        name: 'j1' as Identifier,
        plan: [
          {
            task: 'task' as Identifier,
            config: {
              image_resource: {
                source: {
                  repository: 'alpine',
                  tag: 'latest',
                },
                type: 'rt' as Identifier,
              },
              platform: 'linux',
              run: {
                path: '/bin/sh',
                args: ['-exuc', 'echo "Hello, world!"'],
              },
            },
          },
        ],
      },
      {
        name: 'j2' as Identifier,
        plan: [
          {
            get: 'r' as Identifier,
            passed: ['j1'] as Identifier[],
          },
        ],
      },
    ],
    resources: [
      {
        name: 'r' as Identifier,
        type: 'registry-image' as Identifier,
        source: {},
      },
    ],
  })

  t.true(warnings.has_fatal())
  t.deepEqual(warnings.get_warnings(), [
    new ValidationWarning({
      type: ValidationWarningType.Fatal,
      messages: ['Job "j1" does not interact with resource "r"'],
    }),
  ])
})

test("doesn't allow duplicate names", (t) => {
  const warnings = validate_get_steps({
    jobs: [
      {
        name: 'aj' as Identifier,
        plan: [
          {
            get: 'ag' as Identifier,
          },
          {
            get: 'ag' as Identifier,
          },
        ],
      },
    ],
  })

  t.true(warnings.has_fatal())
  t.deepEqual(warnings.get_warnings(), [
    new ValidationWarning({
      type: ValidationWarningType.Fatal,
      messages: [
        'Get step "ag" already exists. To fix this, rename one of the get steps to something else.',
      ],
    }),
  ])
})

test("doesn't allow an unknown job in passed", (t) => {
  const warnings = validate_get_steps({
    jobs: [
      {
        name: 'aj' as Identifier,
        plan: [
          {
            get: 'ag' as Identifier,
            passed: ['aj1'] as Identifier[],
          },
        ],
      },
    ],
  })

  t.true(warnings.has_fatal())
  t.deepEqual(warnings.get_warnings(), [
    new ValidationWarning({
      type: ValidationWarningType.Fatal,
      messages: ['Get step "ag" relies on an unknown job: "aj1"'],
    }),
  ])
})
