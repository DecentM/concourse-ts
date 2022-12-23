import * as YAML from 'yaml'

import {Pipeline} from './components/pipeline'
import {Task} from './components/task'

export * as Type from './declarations/types'

export * from './components/pipeline'
export * from './components/resource'
export * from './components/resource-type'
export * from './components/task'

export const compile = (input: Pipeline | Task) => {
  return YAML.stringify(input.serialise())
}
