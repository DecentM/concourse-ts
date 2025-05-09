// https://github.com/concourse/concourse/blob/6e9795b98254c86ca1c5ebed138d427424eae5f1/atc/configvalidate/validate.go#L475

import { validate } from 'csstree-validator'

import * as Type from '../declarations/types.js'
import { ValidationWarningType, WarningStore } from '../utils/warning-store/index.js'

export const validate_display = (pipeline: Type.Pipeline): WarningStore => {
  const warnings = new WarningStore()

  if (!pipeline.display) {
    return warnings
  }

  if (pipeline.display.background_filter) {
    const errors = validate(`.bg { backdrop-filter: ${pipeline.display.background_filter} }`, 'temp.css')

    if (errors.length > 0) {
      for (const error of errors) {
        warnings.add_warning(
          ValidationWarningType.Fatal,
          `background_filter is not valid CSS: "${pipeline.display.background_filter}". ${error.message}`
        )
      }

    }
  }

  if (pipeline.display.background_image) {
    // Node and Go URL parsing differ. The WHATWG URL class only accepts absolute
    // URLs, so we filter those here.
    if (
      pipeline.display.background_image.startsWith('/') ||
      pipeline.display.background_image.startsWith('./')
    ) {
      return warnings
    }

    let url: URL

    try {
      url = new URL(pipeline.display.background_image)
    } catch {
      return warnings.add_warning(
        ValidationWarningType.Fatal,
        `background_image is not a valid URL: "${pipeline.display.background_image}"`
      )
    }

    switch (url.protocol) {
      case 'http:':
      case 'https:':
      case '':
        break

      default:
        warnings.add_warning(
          ValidationWarningType.Fatal,
          'background_image scheme must be either http, https or relative'
        )
    }
  }

  return warnings
}
