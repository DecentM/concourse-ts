// https://github.com/concourse/concourse/blob/6e9795b98254c86ca1c5ebed138d427424eae5f1/atc/configvalidate/validate.go#L475

import * as Type from '../../declarations/types'
import {ValidationWarningType, WarningStore} from '../../utils/warning-store'

export const validate_display = (pipeline: Type.Pipeline): WarningStore => {
  const warnings = new WarningStore()

  if (!pipeline.display || !pipeline.display.background_image) {
    return warnings
  }

  // Node and Go URL parsing differ. The WHATWG URL class only accepts absolute
  // URLs, so we filter those here.
  if (
    pipeline.display.background_image.startsWith('/') ||
    pipeline.display.background_image.startsWith('.')
  ) {
    return warnings
  }

  let url: URL

  try {
    url = new URL(pipeline.display.background_image)
  } catch (error) {
    if (error instanceof Error) {
      return warnings.add_warning(
        ValidationWarningType.Fatal,
        `background_image is not a valid URL: ${pipeline.display.background_image}`
      )
    }

    return warnings.add_warning(
      ValidationWarningType.Fatal,
      `Unknown internal error occurred while validating display.background_image`,
      error
    )
  }

  switch (url.protocol) {
    case 'http:':
    case 'https:':
    case '':
      break

    default:
      return warnings.add_warning(
        ValidationWarningType.Fatal,
        'background_image scheme must be either http, https or relative'
      )
  }

  return warnings
}
