import {Customiser} from './customiser'

export type Recipe<CustomisedComponent = void, CustomisedParent = void> = (
  customise?: Customiser<CustomisedComponent, CustomisedParent>
) => (component: CustomisedComponent) => void
