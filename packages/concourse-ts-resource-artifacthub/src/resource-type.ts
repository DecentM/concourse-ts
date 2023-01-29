import { ResourceType, Type } from '@decentm/concourse-ts'

export type Input = {
  tag?: string
}

export class ArtifacthubResourceType extends ResourceType {
  constructor(
    name: string,
    input?: Input,
    init?: Type.Initer<ArtifacthubResourceType>
  ) {
    super(`${name}_type`)

    this.type = 'registry-image'

    this.source = {
      repository: 'ghcr.io/hdisysteme/artifacthub-resource',
      tag: input?.tag ?? 'latest',
    }

    if (init) {
      init(this)
    }
  }
}
