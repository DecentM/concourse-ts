import {Pipeline} from '../components'
import {Customiser} from './customiser'

export type Recipe<Group extends string = never> = (
  customise?: Customiser<Pipeline<Group>, void>
) => (pipeline: Pipeline<Group>) => void
