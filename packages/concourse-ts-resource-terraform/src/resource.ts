import { Resource } from '@decentm/concourse-ts'
import { TerraformResourceType } from './resource-type'

type Source = {
  // TODO: Fill this out
}

export type PutParams = {
  // TODO: Fill this out
}

export class TerraformResource extends Resource<Source, PutParams> {
  constructor(
    public override name: string,
    type: TerraformResourceType,
    source: Source
  ) {
    super(name, type)

    this.source = source
  }
}
