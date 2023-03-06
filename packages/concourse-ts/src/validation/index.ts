import * as Type from '../declarations/types'
import {type_of} from '../utils/type-of'

import {ValidationWarningType, WarningStore} from '../utils/warning-store'
import {validate_cycle} from './cycle'
import {validate_display} from './display'
import {validate_groups} from './groups'
import {validate_jobs} from './jobs'
import {validate_prototypes} from './prototypes'
import {validate_resource_types} from './resource-types'
import {validate_resources} from './resources'
import {validate_tasks} from './tasks'
import {validate_var_sources} from './var-sources'
import {validate_commands} from './commands'
import {validate_steps} from './steps'

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
    validate_tasks(pipeline),
    validate_commands(pipeline),
    validate_steps(pipeline)
  )

  return warnings
}
