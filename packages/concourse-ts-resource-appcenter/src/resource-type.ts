import { ResourceType, Type } from '@decentm/concourse-ts'

export type Input = {
  tag?: string
}

export class AppcenterResourceType extends ResourceType {
  constructor(
    name: string,
    input?: Input,
    init?: Type.Initer<AppcenterResourceType>
  ) {
    super(`${name}_type`)

    this.type = 'registry-image'

    this.source = {
      repository: 'tomoyukim/concourse-appcenter-resource',
      tag: input?.tag ?? 'latest',
    }

    if (init) {
      init(this)
    }
  }
}
