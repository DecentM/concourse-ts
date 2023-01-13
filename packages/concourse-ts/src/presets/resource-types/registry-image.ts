import {ResourceType} from '../../components/resource-type'
import {Initer} from '../../declarations/initialisable'

export class RegistryImage extends ResourceType {
  constructor(init?: Initer<RegistryImage>) {
    super('registry-image')

    if (init) {
      init(this)
    }
  }
}
