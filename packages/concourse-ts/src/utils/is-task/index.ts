import {Identifier} from '../identifier'
import * as Type from '../../declarations/types'

export const is_task = <Input extends Identifier, Output extends Identifier>(
  input: object
): input is Type.Task<Input, Output> => {
  return 'platform' in input && 'run' in input
}
