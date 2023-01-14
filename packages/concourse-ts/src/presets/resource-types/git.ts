import {ResourceType} from '../../components/resource-type'
import {Initer} from '../../declarations/initialisable'

export type GitInput = {
  tag?: string
}

export class Git extends ResourceType {
  constructor(name: string, input?: GitInput, init?: Initer<Git>) {
    super(`${name}_type`)

    this.source = {
      repository: 'concourse/git-resource',
      tag: input?.tag ?? 'latest',
    }

    this.type = 'git'

    if (init) {
      init(this)
    }
  }
}
