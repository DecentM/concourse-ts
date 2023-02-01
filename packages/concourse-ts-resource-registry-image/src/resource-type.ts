import { ResourceType, Type } from '@decentm/concourse-ts'

export type Input = {
  /**
   * https://hub.docker.com/r/concourse/registry-image-resource/tags
   */
  tag: string
}

export class RegistryImageResourceType extends ResourceType {
  constructor(
    name: string,
    input: Input,
    init?: Type.Initer<RegistryImageResourceType>
  ) {
    super(`${name}_type`)

    this.type = 'registry-image'

    this.source = {
      repository: 'concourse/registry-image-resource',
      tag: input.tag,
    }

    if (init) {
      init(this)
    }
  }
}
