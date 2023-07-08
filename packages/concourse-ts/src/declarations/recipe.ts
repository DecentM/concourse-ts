import {Pipeline} from '../components'
import {Customiser} from './customiser'

export type Recipe<
  Group extends string = never,
  CustomisedComponent = Pipeline<Group>,
  CustomisedParent = void,
> = (
  customise?: Customiser<CustomisedComponent, CustomisedParent>
) => (component: CustomisedComponent) => void
