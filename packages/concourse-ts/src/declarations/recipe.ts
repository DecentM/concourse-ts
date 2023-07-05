import {Pipeline} from '../components'
import {Customiser} from './customiser'

export type Recipe<Options = never> = (
  options: Options
) => (customise?: Customiser<Pipeline, void>) => (pipeline: Pipeline) => void
