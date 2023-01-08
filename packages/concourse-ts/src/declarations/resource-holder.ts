import * as Type from './types'
import {Resource} from '../components/resource'
import {Serialisable} from './serialisable'
import {Config} from './types'

export abstract class ResourceStorage<
  SourceType extends Config,
  PutParams extends Config,
  GetParams extends Config
> extends Serialisable<Type.Resource> {
  private resource: Resource<SourceType, PutParams, GetParams>

  public set_resource(
    resource: Resource<SourceType, PutParams, GetParams>
  ): void {
    this.resource = resource
  }

  public serialise() {
    return this.resource.serialise()
  }
}
