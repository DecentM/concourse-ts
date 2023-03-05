import test from 'ava'
import {Identifier} from '../../utils'
import {
  ValidationWarning,
  ValidationWarningType,
} from '../../utils/warning-store'

import {validate_commands} from './commands'

test('passes with correct commands', (t) => {
  const warnings = validate_commands({
    jobs: [
      {
        name: 'my-job' as Identifier,
        plan: [
          {
            task: 'my-task' as Identifier,
            config: {
              image_resource: {
                type: 'registry-image' as Identifier,
                source: {
                  repository: 'alpine',
                  tag: 'latest',
                },
              },

              platform: 'linux',

              run: {
                path: '/bin/sh',
              },
            },
          },
        ],
      },
    ],
  })

  t.is(warnings.has_fatal(), false)
  t.deepEqual(warnings.get_warnings(), [])
})

test('detects commands with no path, with workdir', (t) => {
  const warnings = validate_commands({
    jobs: [
      {
        name: 'my-job' as Identifier,
        plan: [
          {
            task: 'my-task' as Identifier,
            config: {
              image_resource: {
                type: 'registry-image' as Identifier,
                source: {
                  repository: 'alpine',
                  tag: 'latest',
                },
              },

              platform: 'linux',

              run: {
                dir: '/asd',
                path: '',
              },
            },
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
        'Command running in "/asd" contains no path. Add a path to a binary to fix this (for example: "/bin/sh").',
      ],
    }),
  ])
})

test('detects commands with no path, without workdir', (t) => {
  const warnings = validate_commands({
    jobs: [
      {
        name: 'my-job' as Identifier,
        plan: [
          {
            task: 'my-task' as Identifier,
            config: {
              image_resource: {
                type: 'registry-image' as Identifier,
                source: {
                  repository: 'alpine',
                  tag: 'latest',
                },
              },

              platform: 'linux',

              run: {
                path: '',
              },
            },
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
        'Command contains no path. Add a path to a binary to fix this (for example: "/bin/sh").',
      ],
    }),
  ])
})

test('detects commands with relative path', (t) => {
  const warnings = validate_commands({
    jobs: [
      {
        name: 'my-job' as Identifier,
        plan: [
          {
            task: 'my-task' as Identifier,
            config: {
              image_resource: {
                type: 'registry-image' as Identifier,
                source: {
                  repository: 'alpine',
                  tag: 'latest',
                },
              },

              platform: 'linux',

              run: {
                path: 'sh',
              },
            },
          },
        ],
      },
    ],
  })

  t.is(warnings.has_fatal(), false)
  t.deepEqual(warnings.get_warnings(), [
    new ValidationWarning({
      type: ValidationWarningType.NonFatal,
      messages: [
        'Command "sh" uses a binary from $PATH! This makes it vulnerable to injection attacks. Specify the absolute path of the binary to fix this warning. (e.g.: "/bin/sh" instead of "sh")',
      ],
    }),
  ])
})

test('ignores non-task-steps', (t) => {
  const warnings = validate_commands({
    jobs: [
      {
        name: 'my-job' as Identifier,
        plan: [
          {
            do: [],
          },
        ],
      },
    ],
  })

  t.is(warnings.has_fatal(), false)
  t.deepEqual(warnings.get_warnings(), [])
})
