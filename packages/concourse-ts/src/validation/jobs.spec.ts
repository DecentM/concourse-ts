import test from 'ava'
import {Identifier} from '../utils'

import {ValidationWarning, ValidationWarningType} from '../utils/warning-store'

import {validate_jobs} from './jobs'

test('requires at least one job', (t) => {
  const warnings = validate_jobs({
    jobs: [],
  })

  t.true(warnings.has_fatal())
  t.deepEqual(warnings.get_warnings(), [
    new ValidationWarning({
      type: ValidationWarningType.Fatal,
      messages: ['pipeline must contain at least one job'],
    }),
  ])
})

test('requires jobs array', (t) => {
  const warnings = validate_jobs({
    jobs: undefined as never,
  })

  t.true(warnings.has_fatal())
  t.deepEqual(warnings.get_warnings(), [
    new ValidationWarning({
      type: ValidationWarningType.Fatal,
      messages: ['pipeline must contain at least one job'],
    }),
  ])
})

test("doesn't allow two jobs with the same name", (t) => {
  const warnings = validate_jobs({
    jobs: [
      {
        name: 'a' as Identifier,
        plan: [],
      },
      {
        name: 'a' as Identifier,
        plan: [],
      },
    ],
  })

  t.true(warnings.has_fatal())
  t.deepEqual(warnings.get_warnings(), [
    new ValidationWarning({
      type: ValidationWarningType.Fatal,
      messages: ['job 0 and 1 have the same name: "a"'],
    }),
  ])
})

test("doesn't allow jobs with empty name", (t) => {
  const warnings = validate_jobs({
    jobs: [
      {
        name: '' as Identifier,
        plan: [],
      },
    ],
  })

  t.true(warnings.has_fatal())
  t.deepEqual(warnings.get_warnings(), [
    new ValidationWarning({
      type: ValidationWarningType.Fatal,
      messages: ['jobs[0]: identifier cannot be an empty string'],
    }),
  ])
})

test('enforces mutually exclusivity of build_logs config', (t) => {
  const warnings = validate_jobs({
    jobs: [
      {
        name: 'a' as Identifier,
        build_logs_to_retain: 5,
        build_log_retention: {
          builds: 5,
        },
        plan: [],
      },
    ],
  })

  t.true(warnings.has_fatal())
  t.deepEqual(warnings.get_warnings(), [
    new ValidationWarning({
      type: ValidationWarningType.Fatal,
      messages: [
        "jobs.a can't use both build_log_retention and build_logs_to_retain",
      ],
    }),
  ])
})

test("doesn't allow negative build_logs_to_retain", (t) => {
  const warnings = validate_jobs({
    jobs: [
      {
        name: 'a' as Identifier,
        build_logs_to_retain: -5,
        plan: [],
      },
    ],
  })

  t.true(warnings.has_fatal())
  t.deepEqual(warnings.get_warnings(), [
    new ValidationWarning({
      type: ValidationWarningType.Fatal,
      messages: ['jobs.a has negative build_logs_to_retain: -5'],
    }),
  ])
})

test("doesn't allow negative build_log_retention.builds", (t) => {
  const warnings = validate_jobs({
    jobs: [
      {
        name: 'a' as Identifier,
        build_log_retention: {
          builds: -5,
        },
        plan: [],
      },
    ],
  })

  t.true(warnings.has_fatal())
  t.deepEqual(warnings.get_warnings(), [
    new ValidationWarning({
      type: ValidationWarningType.Fatal,
      messages: ['jobs.a has negative build_log_retention.builds: -5'],
    }),
  ])
})

test("doesn't allow negative build_log_retention.days", (t) => {
  const warnings = validate_jobs({
    jobs: [
      {
        name: 'a' as Identifier,
        build_log_retention: {
          days: -5,
        },
        plan: [],
      },
    ],
  })

  t.true(warnings.has_fatal())
  t.deepEqual(warnings.get_warnings(), [
    new ValidationWarning({
      type: ValidationWarningType.Fatal,
      messages: ['jobs.a has negative build_log_retention.days: -5'],
    }),
  ])
})

test("doesn't allow negative build_log_retention.minimum_succeeded_builds", (t) => {
  const warnings = validate_jobs({
    jobs: [
      {
        name: 'a' as Identifier,
        build_log_retention: {
          minimum_succeeded_builds: -5,
        },
        plan: [],
      },
    ],
  })

  t.true(warnings.has_fatal())
  t.deepEqual(warnings.get_warnings(), [
    new ValidationWarning({
      type: ValidationWarningType.Fatal,
      messages: [
        'jobs.a has negative build_log_retention.minimum_succeeded_builds: -5',
      ],
    }),
  ])
})

test("doesn't allow violated minimum_builds", (t) => {
  const warnings = validate_jobs({
    jobs: [
      {
        name: 'a' as Identifier,
        build_log_retention: {
          minimum_succeeded_builds: 4,
          builds: 2,
        },
        plan: [],
      },
    ],
  })

  t.true(warnings.has_fatal())
  t.deepEqual(warnings.get_warnings(), [
    new ValidationWarning({
      type: ValidationWarningType.Fatal,
      messages: [
        'jobs.a has build_log_retention.min_success_builds: 4 greater than build_log_retention.min_success_builds: 2',
      ],
    }),
  ])
})
