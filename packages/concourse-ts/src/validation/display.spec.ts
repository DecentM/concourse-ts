import test from 'ava'

import {
  ValidationWarning,
  ValidationWarningType,
} from '../utils/warning-store/index.js'

import { validate_display } from './display.js'

test('allows https URLs', (t) => {
  const warnings = validate_display({
    jobs: [],
    display: {
      background_image: 'https://source.unsplash.com/random/1920x1080/?robots',
    },
  })

  t.is(warnings.has_fatal(), false)
  t.deepEqual(warnings.get_warnings(), [])
})

test('allows http URLs', (t) => {
  const warnings = validate_display({
    jobs: [],
    display: {
      background_image: 'http://source.unsplash.com/random/1920x1080/?robots',
    },
  })

  t.is(warnings.has_fatal(), false)
  t.deepEqual(warnings.get_warnings(), [])
})

test('passes without display', (t) => {
  const warnings = validate_display({
    jobs: [],
  })

  t.is(warnings.has_fatal(), false)
  t.deepEqual(warnings.get_warnings(), [])
})

test('allows relative URLs starting with a dot', (t) => {
  const warnings = validate_display({
    jobs: [],
    display: {
      background_image: './image.png',
    },
  })

  t.is(warnings.has_fatal(), false)
  t.deepEqual(warnings.get_warnings(), [])
})

test('allows relative URLs starting with a slash', (t) => {
  const warnings = validate_display({
    jobs: [],
    display: {
      background_image: '/image.png',
    },
  })

  t.is(warnings.has_fatal(), false)
  t.deepEqual(warnings.get_warnings(), [])
})

test('refuses invalid URLs', (t) => {
  const warnings = validate_display({
    jobs: [],
    display: {
      background_image: 'aaa',
    },
  })

  t.is(warnings.has_fatal(), true)
  t.deepEqual(warnings.get_warnings(), [
    new ValidationWarning({
      type: ValidationWarningType.Fatal,
      messages: ['background_image is not a valid URL: "aaa"'],
    }),
  ])
})

test('refuses non-http(s) URLs', (t) => {
  const warnings = validate_display({
    jobs: [],
    display: {
      background_image: 'ftp://example.com/image.png',
    },
  })

  t.is(warnings.has_fatal(), true)
  t.deepEqual(warnings.get_warnings(), [
    new ValidationWarning({
      type: ValidationWarningType.Fatal,
      messages: ['background_image scheme must be either http, https or relative'],
    }),
  ])
})

test('refuses invalid CSS', (t) => {
  const warnings = validate_display({
    jobs: [],
    display: {
      background_filter: 'aaa',
    },
  })

  t.deepEqual(warnings.get_warnings(), [
    new ValidationWarning({
      type: ValidationWarningType.Fatal,
      messages: ['background_filter is not valid CSS: "aaa". Invalid value for `backdrop-filter` property'],
    }),
  ])
})

test('allows valid CSS', (t) => {
  const warnings = validate_display({
    jobs: [],
    display: {
      background_filter: 'blur(5px)',
    },
  })

  t.deepEqual(warnings.get_warnings(), [])
})
