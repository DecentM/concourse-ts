import { ResourceType, Type } from '@decentm/concourse-ts'

export type Input = {
  tag?: string
}

export class ConcourseSlackNotifierResourceType extends ResourceType {
  constructor(name: string, input?: Input, init?: Type.Initer<ConcourseSlackNotifierResourceType>) {
    super(`${name}_type`)

    this.type = 'registry-image'

    // TODO: Fill this out
    this.source = {
      repository: '',
      tag: input?.tag ?? '',
    }

    if (init) {
      init(this)
    }
  }
}
