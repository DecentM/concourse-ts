// https://github.com/concourse/concourse/blob/6e9795b98254c86ca1c5ebed138d427424eae5f1/atc/configvalidate/validate.go#L253

import * as Type from '../../declarations/types'
import {ValidationWarningType, WarningStore} from './declarations'

export const validatePrototypes = (c: Type.Pipeline) => {
  const warnings = new WarningStore()

  // TODO: Implement this once we have typings for prototypes

  if ('prototypes' in c) {
    warnings.add_warning(
      ValidationWarningType.Fatal,
      'concourse-ts does not support prototypes yet'
    )
  }

  return warnings
}
