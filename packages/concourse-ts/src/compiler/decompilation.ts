import {VError} from 'verror'
import * as YAML from 'yaml'
import {Pipeline} from '../components'
import {is_pipeline} from '../utils/is-pipeline'

export class Decompilation {
  private input?: string // yaml

  private name?: string

  public set_name(name: string) {
    this.name = name

    return this
  }

  public set_input(yaml: string) {
    if (this.input) {
      throw new VError(
        'This compilation already has an input. Create a new compilation.'
      )
    }

    this.input = yaml

    return this
  }

  public decompile = () => {
    if (!this.input) {
      throw new VError('Cannot get result without input. Call set_input first!')
    }

    const parsed = YAML.parse(this.input)

    if (!is_pipeline(parsed)) {
      throw new VError('Input is not a pipeline!')
    }

    return {
      pipeline: Pipeline.deserialise(
        this.name ?? Date.now().toString(),
        parsed
      ),
    }
  }
}
