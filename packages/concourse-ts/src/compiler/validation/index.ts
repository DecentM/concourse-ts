import * as Type from '../../declarations/types'
import {type_of} from '../../utils/type-of'

import {ValidationWarningType, WarningStore} from '../../utils/warning-store'
import {validate_cycle} from './validate-cycle'
import {validate_display} from './validate-display'
import {validate_groups} from './validate-groups'
import {validate_jobs} from './validate-jobs'
import {validate_prototypes} from './validate-prototypes'
import {validate_resource_types} from './validate-resource-types'
import {validate_resources} from './validate-resources'
import {validate_tasks} from './validate-tasks'
import {validate_var_sources} from './validate-var-sources'

export const validate = (pipeline: Type.Pipeline) => {
  const warnings = new WarningStore()

  if (!pipeline) {
    return warnings.add_warning(
      ValidationWarningType.Fatal,
      `Pipeline is invalid. Expected an object, but got ${type_of(pipeline)}`
    )
  }

  warnings.copy_from(
    validate_groups(pipeline),
    validate_resources(pipeline, {}),
    validate_resource_types(pipeline, {}),
    validate_prototypes(pipeline),
    validate_var_sources(pipeline),
    validate_jobs(pipeline),
    validate_display(pipeline),
    validate_cycle(pipeline),
    validate_tasks(pipeline)
  )

  return warnings
}
