import { ResourceType, Type } from '@decentm/concourse-ts'

export type Input = {
  /**
   * https://hub.docker.com/r/concourse/git-resource/tags
   */
  tag: string
}

export class GitResourceType extends ResourceType {
  constructor(name: string, input: Input, init?: Type.Initer<GitResourceType>) {
    super(`${name}_type`)

    this.type = 'registry-image'

    this.source = {
      repository: 'concourse/git-resource',
      tag: input.tag,
    }

    if (init) {
      init(this)
    }
  }
}
