import {VError} from 'verror'
import * as YAML from 'yaml'
import {transpile, ScriptTarget} from 'typescript'

import pkg from '../../package.json'

import * as Components from '../components'
import {is_pipeline} from '../utils/is-pipeline'

import {write_pipeline} from './writers/pipeline'
import {hoist_all_tasks} from './hoist-task'
import {validate} from '../validation'
import {type_of} from '../utils'

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
    if (type_of(this.input) !== 'undefined') {
      throw new VError(
        'This decompilation already has an input. Create a new decompilation.'
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

    const warnings = validate(parsed)

    const pipeline_name = this.name ?? Date.now().toString()
    const pipeline_string = write_pipeline(pipeline_name, parsed)

    const all_components = Object.keys(Components)
    const used_components: string[] = []

    all_components.forEach((component) => {
      if (pipeline_string.includes(`new ${component}(`)) {
        used_components.push(component)
      }
    })

    const file_contents = `
      import { ${used_components.join(', ')} } from '${this.import_path}'

      export default () => {
        return ${pipeline_string}
      }
    `

    return {
      warnings,
      filename: `${pipeline_name}.pipeline.ts`,
      pipeline: transpile(file_contents, {
        target: ScriptTarget.Latest,
      }),
    }
  }
}
