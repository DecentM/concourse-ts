import * as ConcourseTs from '../../../../../src/index'
import {DURATION_1_MINUTE} from '../constants/duration'

export class Git extends ConcourseTs.ResourceType {
  constructor() {
    super('github')

    this.set_check_every(DURATION_1_MINUTE)
    this.type = 'git'
  }
}
