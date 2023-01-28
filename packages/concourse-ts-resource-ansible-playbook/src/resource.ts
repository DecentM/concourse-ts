import { Resource } from '@decentm/concourse-ts'
import { AnsiblePlaybookResourceType } from './resource-type'

type Source = {
  // TODO: Fill this out
}

export type PutParams = {
  // TODO: Fill this out
}

export class AnsiblePlaybookResource extends Resource<Source, PutParams> {
  constructor(
    public override name: string,
    type: AnsiblePlaybookResourceType,
    source: Source
  ) {
    super(name, type)

    this.source = source
  }
}
