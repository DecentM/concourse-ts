import {ResourceType} from '../../components/resource-type'
import {Initer} from '../../declarations/initialisable'

export class Git extends ResourceType {
  constructor(name: string, init?: Initer<Git>) {
    super(name)

    if (init) {
      init(this)
    }

    this.type = 'git'
  }
}
