import {VError} from 'verror'
import * as YAML from 'yaml'
import prettier from 'prettier'

import pkg from '../../package.json'

import * as Components from '../components'
import {is_pipeline} from '../utils/is-pipeline'

import {write_pipeline} from './writers/pipeline'
import {hoist_all_tasks} from './hoist-task'

export class Decompilation {
  private input?: string // yaml

  private name?: string

  public set_name(name: string) {
    this.name = name

    return this
  }

  private import_path?: string = pkg.name

  public set_import_path(path: string) {
    this.import_path = path

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

  private work_dir = '.'

  public set_work_dir = (work_dir: string) => {
    this.work_dir = work_dir

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

    return this
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

    // Load task configs from disk if they're defined in a separate yaml file
    hoist_all_tasks(this.work_dir, parsed)

    const pipelineName = this.name ?? Date.now().toString()
    const pipelineString = write_pipeline(pipelineName, parsed)

    const allComponents = Object.keys(Components)
    const usedComponents: string[] = []

    allComponents.forEach((component) => {
      if (pipelineString.includes(`new ${component}(`)) {
        usedComponents.push(component)
      }
    })

    const file_contents = `
      import { ${usedComponents.join(', ')} } from '${this.import_path}'

      export default () => {
        return ${pipelineString}
      }
    `

    return {
      filename: `${pipelineName}.pipeline.ts`,
      pipeline: this.prettier_config
        ? prettier.format(file_contents, this.prettier_config)
        : file_contents,
    }
  }
}
