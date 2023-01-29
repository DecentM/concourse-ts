import { ResourceType, Type } from '@decentm/concourse-ts'

export type Input = {
  tag?: string
}

export class ApacheDirectoryIndexResourceType extends ResourceType {
  constructor(
    name: string,
    input?: Input,
    init?: Type.Initer<ApacheDirectoryIndexResourceType>
  ) {
    super(`${name}_type`)

    this.type = 'registry-image'

    this.source = {
      repository: 'mastertinner/apache-directory-index-resource',
      tag: input?.tag ?? 'latest',
    }

    if (init) {
      init(this)
    }
  }
}
