import * as ConcourseTs from '@decentm/concourse-ts'

export class RegistryImage extends ConcourseTs.ResourceType {
  constructor() {
    super('registry-image')
  }
}
