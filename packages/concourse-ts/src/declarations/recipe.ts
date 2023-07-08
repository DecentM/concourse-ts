import {Pipeline} from '../components'
import {Customiser} from './customiser'

export type Recipe<
  Group extends string = never,
  CustomiserInstance = Pipeline<Group>,
  CustomiserParent = void,
> = (
  customise?: Customiser<CustomiserInstance, CustomiserParent>
) => (pipeline: Pipeline<Group>) => void
