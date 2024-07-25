import { Identifier } from '../identifier/index.js'
import * as Type from '../../declarations/types.js'

export const is_task = <Input extends Identifier, Output extends Identifier>(
  input: object
): input is Type.Task<Input, Output> => {
  return 'platform' in input && 'run' in input
}
