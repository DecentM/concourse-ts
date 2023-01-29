import { ResourceType, Type } from '@decentm/concourse-ts'

export type Input = {
  tag?: string
}

export class AnsiblePlaybookResourceType extends ResourceType {
  constructor(
    name: string,
    input?: Input,
    init?: Type.Initer<AnsiblePlaybookResourceType>
  ) {
    super(`${name}_type`)

    this.type = 'registry-image'

    this.source = {
      repository: 'troykinsella/concourse-ansible-playbook-resource',
      tag: input?.tag ?? 'latest',
    }

    if (init) {
      init(this)
    }
  }
}
