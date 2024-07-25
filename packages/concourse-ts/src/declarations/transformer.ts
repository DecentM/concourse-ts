import { Pipeline } from './types.js'

/**
 * A function that modifies serialised Pipeline objects in-place
 */
export type Transformer<Options = unknown> = (
  input: Pipeline,
  options?: Options
) => void
