import * as Type from '../declarations/types.js'

import { WarningStore } from '../utils/warning-store/index.js'
import { validate_cycle } from './cycle.js'
import { validate_display } from './display.js'
import { validate_groups } from './groups.js'
import { validate_jobs } from './jobs.js'
import { validate_prototypes } from './prototypes.js'
import { validate_resource_types } from './resource-types.js'
import { validate_resources } from './resources.js'
import { validate_tasks } from './tasks.js'
import { validate_var_sources } from './var-sources.js'
import { validate_commands } from './commands.js'
import { validate_steps } from './steps.js'

export const validate = (pipeline: Type.Pipeline) => {
  const warnings = new WarningStore()

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
