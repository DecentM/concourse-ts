import * as Type from '../../declarations/types'

export const is_pipeline = (input: object): input is Type.Pipeline => {
  return 'jobs' in input
}
