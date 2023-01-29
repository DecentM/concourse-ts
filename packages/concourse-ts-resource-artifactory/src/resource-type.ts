import { ResourceType, Type } from '@decentm/concourse-ts'

export type Input = {
  /**
   * https://hub.docker.com/r/springio/artifactory-resource/tags
   */
  tag: string
}

export class ArtifactoryResourceType extends ResourceType {
  constructor(
    name: string,
    input: Input,
    init?: Type.Initer<ArtifactoryResourceType>
  ) {
    super(`${name}_type`)

    this.type = 'registry-image'

    this.source = {
      repository: 'springio/artifactory-resource',
      tag: input.tag,
    }

    if (init) {
      init(this)
    }
  }
}
