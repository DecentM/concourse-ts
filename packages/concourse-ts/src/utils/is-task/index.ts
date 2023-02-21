import * as Type from '../../declarations/types'

export const is_task = <Input extends string, Output extends string>(
  input: object
): input is Type.Task<Input, Output> => {
  return 'platform' in input && 'run' in input
}
