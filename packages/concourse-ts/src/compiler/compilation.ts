import {VError} from 'verror'
import * as YAML from 'yaml'

import {Pipeline} from '../components/pipeline'
import {Task} from '../components/task'
import {validate} from './validation'
import {ValidationWarningType, WarningStore} from './validation/declarations'

export class Compilation {
  private input?: Pipeline | Task

  public set_input(input: Pipeline | Task) {
    if (this.input) {
      throw new VError(
        'This compilation already has an input. Create a new compilation.'
      )
    }

    this.input = input

    return this
  }

  private get result() {
    return this.input?.serialise()
  }

  public validate = () => {
    const warnings = new WarningStore()

    if (this.input instanceof Pipeline) {
      warnings.copy_from(validate(this.input.serialise()))
    }

    // TODO: Validate tasks
    warnings.add_warning(
      ValidationWarningType.NonFatal,
      'Task validation skipped, the input is not an instance of Pipeline'
    )

    return warnings
  }

  public compile = () => {
    if (!this.input) {
      throw new VError('Cannot get result without input. Call set_input first!')
    }

    const warnings = this.validate()

    if (warnings.has_fatal()) {
      throw new VError(
        'This pipeline has fatal errors, compilation aborted.',
        ...warnings.get_warnings()
      )
    }

    return YAML.stringify(this.result)
  }
}
