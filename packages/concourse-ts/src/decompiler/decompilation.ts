import {VError} from 'verror'
import * as YAML from 'yaml'
import prettier from 'prettier'

import * as Components from '../components'
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
        'This decompilation already has an input. Create a new compilation.'
      )
    }

    this.input = yaml

    return this
  }

  private prettier_config: prettier.Options

  public set_prettier_config = (
    config: prettier.Options = {
      semi: false,
      singleQuote: true,
      tabWidth: 2,
      useTabs: false,
      arrowParens: 'always',
      endOfLine: 'lf',
      printWidth: 90,
      trailingComma: 'es5',
      parser: 'typescript',
    }
  ) => {
    this.prettier_config = config
  }

  public decompile = () => {
    if (!this.input) {
      throw new VError('Cannot get result without input. Call set_input first!')
    }

    const parsed = YAML.parse(this.input, {
      merge: true,
    })

    if (!is_pipeline(parsed)) {
      throw new VError('Input is not a pipeline!')
    }

    const pipeline = Components.Pipeline.deserialise(
      this.name ?? Date.now().toString(),
      parsed
    )

    const pipelineString = pipeline.write()
    const allComponents = Object.keys(Components)
    const usedComponents: string[] = []

    allComponents.forEach((component) => {
      if (pipelineString.includes(`new ${component}(`)) {
        usedComponents.push(component)
      }
    })

    const file_contents = `
      import { ${usedComponents.join(', ')} } from '@decentm/concourse-ts'

      export default () => {
        return ${pipelineString}
      }
    `

    return {
      filename: `${pipeline.name}.pipeline.ts`,
      pipeline: this.prettier_config
        ? prettier.format(file_contents, this.prettier_config)
        : file_contents,
    }
  }
}
