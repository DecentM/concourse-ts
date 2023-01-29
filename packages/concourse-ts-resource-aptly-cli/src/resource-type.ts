import { ResourceType, Type } from '@decentm/concourse-ts'

export type Input = {
  tag?: string
}

export class AptlyCliResourceType extends ResourceType {
  constructor(
    name: string,
    input?: Input,
    init?: Type.Initer<AptlyCliResourceType>
  ) {
    super(`${name}_type`)

    this.type = 'registry-image'

    this.source = {
      repository: 'shyxormz/aptly-cli-resource',
      tag: input?.tag ?? 'latest',
    }

    if (init) {
      init(this)
    }
  }
}
