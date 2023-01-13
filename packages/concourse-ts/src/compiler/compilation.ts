import {VError} from 'verror'
import * as YAML from 'yaml'

import {Pipeline} from '../components/pipeline'
import {validate} from './validation'

export class Compilation {
  private input?: Pipeline

  public set_input(input: Pipeline) {
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
    return validate(this.result)
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
