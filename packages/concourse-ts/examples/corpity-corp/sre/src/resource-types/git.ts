import * as ConcourseTs from '../../../../../src'

export class Git extends ConcourseTs.ResourceType {
  constructor() {
    super('github')

    this.set_check_every(ConcourseTs.Utils.get_duration({hours: 24}))
    this.type = 'git'
  }
}
