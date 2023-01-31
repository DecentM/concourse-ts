import { ResourceType, Type } from '@decentm/concourse-ts'

export type Input = {
  /**
   * https://hub.docker.com/r/srinivasavasu/concourse-k8s/tags
   */
  tag?: string
}

export class K8sResourceType extends ResourceType {
  constructor(name: string, input?: Input, init?: Type.Initer<K8sResourceType>) {
    super(`${name}_type`)

    this.type = 'registry-image'

    this.source = {
      repository: 'srinivasavasu/concourse-k8s',
      tag: input?.tag ?? 'latest',
    }

    if (init) {
      init(this)
    }
  }
}
