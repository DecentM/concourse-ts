import * as YAML from 'yaml'

export * from './utils/with-try'

import {Pipeline} from './components/pipeline'
import {Task} from './components/task'

export {AnyStep} from './components/step'
export {Initer} from './declarations/initialisable'

export * as Type from './declarations/types'
export * as Utils from './utils'

export * from './components/pipeline'
export * from './components/resource'
export * from './components/resource-type'
export * from './components/task'
export * from './components/job'

export const compile = (input: Pipeline | Task) => {
  return YAML.stringify(input.serialise())
}
