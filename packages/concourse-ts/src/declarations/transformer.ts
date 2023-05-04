import {Pipeline} from './types'

/**
 * A function that modifies serialised Pipeline objects in-place
 */
export type Transformer = (input: Pipeline, work_dir?: string) => void
