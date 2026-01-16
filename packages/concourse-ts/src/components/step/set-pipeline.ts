import { Customiser } from '../../declarations/customiser.js'
import { get_identifier } from '../../utils/identifier/index.js'
import * as Type from '../../declarations/types.js'
import { Resource } from '../resource.js'

import { Step } from './base.js'
import { Pipeline } from '../pipeline.js'

/**
 * Configures a pipeline from within a pipeline. Useful for creating self-updating
 * pipelines or dynamically generating pipelines based on build artifacts.
 *
 * https://concourse-ci.org/docs/steps/set-pipeline/
 */
export class SetPipelineStep extends Step<Type.SetPipelineStep> {
  private static customiser: Customiser<SetPipelineStep>

  /**
   * Customises all SetPipelineSteps constructed after calling this function.
   *
   * {@link Type.Customiser}
   *
   * @param {Customiser<SetPipelineStep>} init
   */
  public static customise = (init: Customiser<SetPipelineStep>) => {
    SetPipelineStep.customiser = init
  }

  constructor(
    public override name: string,
    customise?: Customiser<SetPipelineStep>
  ) {
    super(name)

    if (SetPipelineStep.customiser) {
      SetPipelineStep.customiser(this)
    }

    if (customise) {
      customise(this)
    }
  }

  private pipeline: Pipeline | string

  /**
   * Sets the pipeline to configure. Can be a Pipeline instance or a string
   * name. Use "self" to update the current pipeline.
   *
   * https://concourse-ci.org/docs/steps/set-pipeline/#set_pipeline-step
   *
   * @param {Pipeline | string} pipeline The pipeline to set, or "self"
   */
  public set_pipeline = (pipeline: Pipeline | string) => {
    this.pipeline = pipeline
  }

  private file?: Type.FilePath

  /**
   * Sets the path to the pipeline configuration file. Required when not
   * using an inline Pipeline instance.
   *
   * https://concourse-ci.org/docs/steps/set-pipeline/#set_pipeline-step
   *
   * @param {Type.FilePath} file Path to the pipeline YAML file
   */
  public set_file = (file: Type.FilePath) => {
    this.file = file
  }

  private instance_vars: Type.Vars

  /**
   * Sets instance variables for instanced pipelines. Instance variables are
   * used to differentiate between instances of the same pipeline template.
   *
   * https://concourse-ci.org/docs/steps/set-pipeline/#set_pipeline-step
   *
   * @param {Type.Vars} vars Instance variable key-value pairs
   */
  public set_instance_vars = (vars: Type.Vars) => {
    if (!this.instance_vars) this.instance_vars = {}

    this.instance_vars = {
      ...this.instance_vars,
      ...vars,
    }
  }

  private vars: Type.Vars

  /**
   * Sets template variables to pass to the pipeline configuration. These
   * are used for parameterising pipeline templates.
   *
   * https://concourse-ci.org/docs/steps/set-pipeline/#set_pipeline-step
   *
   * @param {Type.Vars} vars Variable key-value pairs
   */
  public set_vars = (vars: Type.Vars) => {
    if (!this.vars) this.vars = {}

    this.vars = {
      ...this.vars,
      ...vars,
    }
  }

  private var_files: Type.FilePath[]

  /**
   * Adds paths to YAML files containing variables to pass to the pipeline.
   *
   * https://concourse-ci.org/docs/steps/set-pipeline/#set_pipeline-step
   *
   * @param {...Type.FilePath[]} paths Paths to variable files
   */
  public add_var_file = (...paths: Type.FilePath[]) => {
    if (!this.var_files) this.var_files = []

    this.var_files.push(...paths)
  }

  private team?: string

  /**
   * Sets the team to configure the pipeline on. By default, the pipeline
   * is configured on the current team.
   *
   * https://concourse-ci.org/docs/steps/set-pipeline/#set_pipeline-step
   *
   * @param {string} team The team name
   */
  public set_team = (team: string) => {
    this.team = team
  }

  /**
   * @internal Used by the compiler
   */
  public get_task_steps() {
    return this.get_base_task_steps()
  }

  /**
   * @internal Used by the compiler
   */
  public get_resources(): Resource[] {
    return this.get_base_resources()
  }

  /**
   * @internal Used by the compiler
   *
   * @returns {Type.SetPipelineStep} The serialised set_pipeline step configuration
   */
  public serialise() {
    const result: Type.SetPipelineStep = {
      ...this.serialise_base(),
      set_pipeline:
        typeof this.pipeline === 'string'
          ? get_identifier(this.pipeline)
          : get_identifier(this.pipeline?.name),
      file: this.file,
      instance_vars: this.instance_vars,
      vars: this.vars,
      var_files: this.var_files,
      team: get_identifier(this.team),
    }

    return result
  }
}
