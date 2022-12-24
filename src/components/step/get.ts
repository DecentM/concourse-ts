import {VError} from 'verror'
import {Initer} from '~/declarations/initialisable'

import * as Type from '~/declarations/types'

import {Job} from '../job'
import {Resource} from '../resource'

import {Step} from './_base'

export class GetStep extends Step<Type.GetStep> {
  constructor(init?: Initer<GetStep>) {
    super()

    if (init) {
      init(this)
    }
  }

  private get?: Type.Identifier

  public set_get = (resource: Resource) => {
    this.get = resource.name
  }

  private resource?: Type.Identifier

  public set_resource = (resource: Resource) => {
    this.resource = resource.name
  }

  private passed: Type.Identifier[] = []

  public add_passed = (job: Job) => {
    this.passed.push(job.name)
  }

  private params: Type.Config = {}

  public set_param = (key: string, value: Type.YamlValue) => {
    this.params[key] = value
  }

  public trigger = true

  public version: Type.Version = 'latest'

  public serialise() {
    if (!this.get) {
      throw new VError(
        'Cannot serialise GetStep because "get" has not been set'
      )
    }

    const result: Type.GetStep = {
      ...this.serialise_base(),
      get: this.get,
      resource: this.resource,
      passed: this.passed,
      params: this.params,
      trigger: this.trigger,
      version: this.version,
    }

    return result
  }
}
