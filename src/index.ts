import * as YAML from 'yaml'

import {Pipeline} from './components/pipeline'
import {Task} from './components/task'

export * from './declarations/types'

export const compile = (input: Pipeline | Task) => {
  return YAML.stringify(input.serialise())
}
