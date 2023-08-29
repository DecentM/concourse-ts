import * as ConcourseTs from '@decentm/concourse-ts'
import VError from 'verror'

import { SealedBuilder } from '../declarations/builder'

import { TryStepBuilder } from './steps/try'
import { DoStepBuilder } from './steps/do'
import { GetStepBuilder } from './steps/get'
import { InParallelStepBuilder } from './steps/in-parallel'
import { LoadVarStepBuilder } from './steps/load-var'
import { PutStepBuilder } from './steps/put'
import { SetPipelineStepBuilder } from './steps/set-pipeline'
import { TaskStepBuilder } from './steps/task'
import { StepBuilderBase } from './steps/base'

export type AllStep =
  | ConcourseTs.DoStep
  | ConcourseTs.TryStep
  | ConcourseTs.InParallelStep
  | ConcourseTs.GetStep
  | ConcourseTs.PutStep
  | ConcourseTs.TaskStep
  | ConcourseTs.LoadVarStep
  | ConcourseTs.SetPipelineStep

export class StepBuilder implements SealedBuilder<AllStep> {
  public build(): AllStep {
    if (!this._builder) {
      throw new VError('Cannot build step without a step type')
    }

    this._customise(this._builder)

    return this._builder.build()
  }

  private _builder: StepBuilderBase<AllStep>

  private _customise: ConcourseTs.Type.Customiser<StepBuilderBase<AllStep>>

  public try(
    customise: ConcourseTs.Type.Customiser<TryStepBuilder>
  ): SealedBuilder<ConcourseTs.TryStep> {
    this._builder = new TryStepBuilder()
    this._customise = customise

    return this as SealedBuilder<ConcourseTs.TryStep>
  }

  public do(
    customise: ConcourseTs.Type.Customiser<DoStepBuilder>
  ): SealedBuilder<ConcourseTs.DoStep> {
    this._builder = new DoStepBuilder()
    this._customise = customise

    return this as SealedBuilder<ConcourseTs.DoStep>
  }

  public get(
    customise: ConcourseTs.Type.Customiser<GetStepBuilder>
  ): SealedBuilder<ConcourseTs.GetStep> {
    this._builder = new GetStepBuilder()
    this._customise = customise

    return this as SealedBuilder<ConcourseTs.GetStep>
  }

  public in_parallel(
    customise: ConcourseTs.Type.Customiser<InParallelStepBuilder>
  ): SealedBuilder<ConcourseTs.InParallelStep> {
    this._builder = new InParallelStepBuilder()
    this._customise = customise

    return this as SealedBuilder<ConcourseTs.InParallelStep>
  }

  public load_var(
    customise: ConcourseTs.Type.Customiser<LoadVarStepBuilder>
  ): StepBuilder {
    this._builder = new LoadVarStepBuilder()
    this._customise = customise

    return this
  }

  public put(customise: ConcourseTs.Type.Customiser<PutStepBuilder>): StepBuilder {
    this._builder = new PutStepBuilder()
    this._customise = customise

    return this
  }

  public set_pipeline(
    customise: ConcourseTs.Type.Customiser<SetPipelineStepBuilder>
  ): StepBuilder {
    this._builder = new SetPipelineStepBuilder()
    this._customise = customise

    return this
  }

  public task(customise: ConcourseTs.Type.Customiser<TaskStepBuilder>): StepBuilder {
    this._builder = new TaskStepBuilder()
    this._customise = customise

    return this
  }
}
