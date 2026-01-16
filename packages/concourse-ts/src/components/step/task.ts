import { Customiser } from '../../declarations/customiser.js'
import { get_identifier, Identifier } from '../../utils/identifier/index.js'
import * as Type from '../../declarations/types.js'
import { Resource } from '../resource.js'

import { Task } from '../task.js'

import { Step } from './base.js'

/**
 * Executes a task, which is the smallest configurable unit in a Concourse
 * pipeline. A task can run any script in any container, with any inputs and
 * outputs.
 *
 * https://concourse-ci.org/docs/steps/task/
 */
export class TaskStep<
  Input extends Identifier = Identifier,
  Output extends Identifier = Identifier,
> extends Step<Type.TaskStep> {
  private static customiser: Customiser<TaskStep>

  /**
   * Customises all TaskSteps constructed after calling this function.
   *
   * {@link Type.Customiser}
   *
   * @param {Customiser<TaskStep>} init
   */
  public static customise = (init: Customiser<TaskStep>) => {
    TaskStep.customiser = init
  }

  constructor(
    public override name: string,
    customise?: Customiser<TaskStep<Input, Output>>
  ) {
    super(name)

    if (TaskStep.customiser) {
      TaskStep.customiser(this)
    }

    if (customise) {
      customise(this)
    }
  }

  private task?: Task<Input, Output>

  /**
   * Sets the task configuration to run. The task defines what container image
   * to use, what command to run, and what inputs/outputs are expected.
   *
   * https://concourse-ci.org/docs/steps/task/#task-step
   *
   * @param {Task<Input, Output>} task The task configuration
   */
  public set_task = (task: Task<Input, Output>) => {
    this.task = task
  }

  /**
   * Returns the task configuration set on this step.
   *
   * @returns {Task<Input, Output> | undefined} The task configuration, if set
   */
  public get_task = () => {
    return this.task
  }

  private file?: string

  /**
   * Sets the path to an external task configuration file. When set, the task
   * config is loaded from this file instead of inline config.
   *
   * https://concourse-ci.org/docs/steps/task/#task-step
   *
   * @param {string} file Path to the task config file (e.g., "my-repo/ci/task.yml")
   */
  public set_file = (file: string) => {
    this.file = file
  }

  private image?: string

  /**
   * Sets an artifact source containing an image to use for the task. Overrides
   * the image specified in the task configuration.
   *
   * https://concourse-ci.org/docs/steps/task/#task-step
   *
   * @param {string} image The name of the artifact containing the image
   */
  public set_image = (image: string) => {
    this.image = image
  }

  private privileged?: boolean

  /**
   * Sets "privileged" to true - avoid calling to keep false.
   * Running a task with elevated privileges allows the container to have
   * full access to the host machine.
   *
   * https://concourse-ci.org/docs/steps/task/#task-step
   */
  public set_privileged = () => {
    this.privileged = true
  }

  private vars: Type.Vars

  /**
   * Sets template variables to pass to the task. These can be used for
   * parameterising task configs loaded from files.
   *
   * https://concourse-ci.org/docs/steps/task/#task-step
   *
   * @param {Type.Vars} vars Key-value pairs for template variables
   */
  public set_vars = (vars: Type.Vars) => {
    if (!this.vars) this.vars = {}

    this.vars = {
      ...this.vars,
      ...vars,
    }
  }

  private params: Type.EnvVars

  /**
   * Sets environment variables to pass to the task. These override any
   * parameters set in the task configuration.
   *
   * https://concourse-ci.org/docs/steps/task/#task-step
   *
   * @param {Type.EnvVars} params Environment variables to set
   */
  public set_params = (params: Type.EnvVars) => {
    if (!this.params) this.params = {}

    this.params = {
      ...this.params,
      ...params,
    }
  }

  private input_mapping?: Record<string, string>

  /**
   * Maps an artifact name to a different input name expected by the task.
   * Useful when artifact names don't match what the task config expects.
   *
   * https://concourse-ci.org/docs/steps/task/#task-step
   *
   * @param {string} input The artifact name available in the job
   * @param {string} mapped_input The input name expected by the task
   */
  public set_input_mapping = (input: string, mapped_input: string) => {
    if (!this.input_mapping) this.input_mapping = {}

    this.input_mapping[input] = mapped_input
  }

  private output_mapping?: Record<string, string>

  /**
   * Maps a task output name to a different artifact name. Useful when the
   * task outputs need to be renamed for downstream steps.
   *
   * https://concourse-ci.org/docs/steps/task/#task-step
   *
   * @param {string} output The output name produced by the task
   * @param {string} mapped_output The artifact name to use in the job
   */
  public set_output_mapping = (output: string, mapped_output: string) => {
    if (!this.output_mapping) this.output_mapping = {}

    this.output_mapping[output] = mapped_output
  }

  /**
   * @internal Used by the compiler
   */
  public get_task_steps() {
    const result = this.get_base_task_steps()

    result.push(this)

    return result
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
   * @returns {Type.TaskStep} The serialised task step configuration
   */
  public serialise() {
    let input_mapping: Record<Input, string>

    if (this.input_mapping) {
      input_mapping = {} as Record<Input, string>

      Object.entries(this.input_mapping).forEach(([input, mapped_input]) => {
        input_mapping[get_identifier(input)] = mapped_input
      })
    }

    let output_mapping: Record<Output, string>

    if (this.output_mapping) {
      output_mapping = {} as Record<Output, string>

      Object.entries(this.output_mapping).forEach(([output, mapped_output]) => {
        output_mapping[get_identifier(output)] = mapped_output
      })
    }

    const result: Type.TaskStep = {
      ...this.serialise_base(),
      task: this.task?.name
        ? get_identifier(this.task.name)
        : get_identifier(`${this.name}_task`),
      config: this.file ? undefined : this.task?.serialise(),
      file: this.file,
      image: get_identifier(this.image),
      privileged: this.privileged,
      vars: this.vars,
      params: this.params,
      input_mapping,
      output_mapping,
    }

    return result
  }
}
