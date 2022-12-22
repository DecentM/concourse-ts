import * as YAML from 'yaml'

import {Pipeline} from './components/pipeline'

export * from './declarations/types'

export const compile = (input: Pipeline) => {
  return YAML.stringify(input.serialise())
}
