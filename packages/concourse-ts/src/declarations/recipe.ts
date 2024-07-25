import { Customiser } from './customiser.js'

export type Recipe<CustomisedComponent = void, CustomisedParent = void> = (
  customise?: Customiser<CustomisedComponent, CustomisedParent>
) => (component: CustomisedComponent) => void
