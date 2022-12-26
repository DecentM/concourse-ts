import {VError} from 'verror'
import {Initer} from '~/declarations/initialisable'

import * as Type from '~/declarations/types'

import {Job} from '../job'
import {Resource} from '../resource'

import {Step} from './_base'

export class GetStep extends Step<Type.GetStep> {
  constructor(public name: string, init?: Initer<GetStep>) {
    super(name)

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

  private passed: Type.Identifier[]

  public add_passed = (...jobs: Job[]) => {
    if (!this.passed) this.passed = []

    this.passed.push(...jobs.map((job) => job.name))
  }

  private params: Type.Config

  public set_param = (...params: Type.Param[]) => {
    if (!this.params) this.params = {}

    params.forEach((param) => {
      this.params[param.key] = param.value
    })
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
