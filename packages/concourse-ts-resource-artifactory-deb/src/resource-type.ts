import { ResourceType, Type } from '@decentm/concourse-ts'

export type Input = {
  tag?: string
}

export class ArtifactoryDebResourceType extends ResourceType {
  constructor(
    name: string,
    input?: Input,
    init?: Type.Initer<ArtifactoryDebResourceType>
  ) {
    super(`${name}_type`)

    this.type = 'registry-image'

    this.source = {
      repository: 'troykinsella/concourse-artifactory-deb-resource',
      tag: input?.tag ?? 'latest',
    }

    if (init) {
      init(this)
    }
  }
}
