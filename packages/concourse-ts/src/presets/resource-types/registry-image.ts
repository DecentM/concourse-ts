import {ResourceType} from '../../components/resource-type'
import {Initer} from '../../declarations/initialisable'

export type RegistryImageInput = {
  tag?: string
}

export class RegistryImage extends ResourceType {
  constructor(
    name: string,
    input?: RegistryImageInput,
    init?: Initer<RegistryImage>
  ) {
    super(`${name}_type`)

    this.type = 'registry-image'

    this.source = {
      repository: 'concourse/registry-image-resource',
      tag: input?.tag ?? 'alpine',
    }

    if (init) {
      init(this)
    }
  }
}
