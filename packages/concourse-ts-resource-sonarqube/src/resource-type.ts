import { ResourceType, Type } from '@decentm/concourse-ts'

export type Input = {
  /**
   * https://hub.docker.com/r/cathive/concourse-sonarqube-resource/tags
   */
  tag?: string
}

export class SonarqubeResourceType extends ResourceType {
  constructor(
    name: string,
    input?: Input,
    init?: Type.Initer<SonarqubeResourceType>
  ) {
    super(`${name}_type`)

    this.type = 'registry-image'

    this.source = {
      repository: 'cathive/concourse-sonarqube-resource',
      tag: input?.tag ?? 'latest',
    }

    if (init) {
      init(this)
    }
  }
}
