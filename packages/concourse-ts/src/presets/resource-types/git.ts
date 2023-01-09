import {ResourceType} from '../../components/resource-type'
import {get_duration} from '../../utils'

export class Git extends ResourceType {
  constructor(name: string) {
    super(name)

    this.set_check_every(get_duration({hours: 24}))
    this.type = 'git'
  }
}
