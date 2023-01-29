import { ResourceType, Type } from '@decentm/concourse-ts'

export type Input = {
  /**
   * https://quay.io/repository/coralogix/eng-concourse-resource-dhall?tab=tags&tag=latest
   */
  tag: string
}

export class DhallResourceType extends ResourceType {
  constructor(name: string, input: Input, init?: Type.Initer<DhallResourceType>) {
    super(`${name}_type`)

    this.type = 'registry-image'

    this.source = {
      repository: 'quay.io/coralogix/eng-concourse-resource-dhall',
      tag: input.tag,
    }

    if (init) {
      init(this)
    }
  }
}
