import * as Type from '../../declarations/types'
import {type_of} from '../../utils/type-of'

import {ValidationWarningType, WarningStore} from './declarations'
import {validateCycle} from './validate-cycle'
import {validateDisplay} from './validate-display'
import {validateGroups} from './validate-groups'
import {validateJobs} from './validate-jobs'
import {validatePrototypes} from './validate-prototypes'
import {validateResourceTypes} from './validate-resource-types'
import {validateResources} from './validate-resources'
import {validateVarSources} from './validate-var-sources'

export const validate = (pipeline: Type.Pipeline) => {
  const warnings = new WarningStore()

  if (!pipeline) {
    return warnings.add_warning(
      ValidationWarningType.Fatal,
      `Pipeline is invalid. Expected an object, but got ${type_of(pipeline)}`
    )
  }

  warnings.copy_from(
    validateGroups(pipeline),
    validateResources(pipeline, {}),
    validateResourceTypes(pipeline, {}),
    validatePrototypes(pipeline),
    validateVarSources(pipeline),
    validateJobs(pipeline),
    validateDisplay(pipeline),
    validateCycle(pipeline)
  )

  return warnings
}
