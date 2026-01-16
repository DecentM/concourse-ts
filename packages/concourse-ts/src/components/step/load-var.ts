import { Customiser } from '../../declarations/customiser.js'
import * as Type from '../../declarations/types.js'

import { get_identifier } from '../../utils/identifier/index.js'
import { get_var } from '../../utils/var/index.js'

import { Resource } from '../resource.js'

import { Step } from './base.js'

/**
 * Loads the contents of a file into a local var at runtime. The file must
 * be present in an artifact, and the var can be used in subsequent steps
 * via ((.:var_name)) syntax.
 *
 * https://concourse-ci.org/docs/steps/load-var/
 */
export class LoadVarStep extends Step<Type.LoadVarStep> {
  private static customiser: Customiser<LoadVarStep>

  /**
   * Customises all LoadVarSteps constructed after calling this function.
   *
   * {@link Type.Customiser}
   *
   * @param {Customiser<LoadVarStep>} init
   */
  public static customise = (init: Customiser<LoadVarStep>) => {
    LoadVarStep.customiser = init
  }

  constructor(
    public override name: string,
    customise?: Customiser<LoadVarStep>
  ) {
    super(name)

    if (LoadVarStep.customiser) {
      LoadVarStep.customiser(this)
    }

    if (customise) {
      customise(this)
    }
  }

  private load_var?: string

  /**
   * Sets the name of the variable to load the file contents into. The variable
   * can be referenced in subsequent steps using ((.:var_name)) syntax.
   *
   * https://concourse-ci.org/docs/steps/load-var/#load_var-step
   *
   * @param {string} load_var The variable name
   */
  public set_load_var = (load_var: string) => {
    this.load_var = load_var
  }

  private file?: Type.FilePath

  /**
   * Sets the path to the file to load. The file must exist in an artifact
   * available to the job.
   *
   * https://concourse-ci.org/docs/steps/load-var/#load_var-step
   *
   * @param {Type.FilePath} file Path to the file to load
   */
  public set_file = (file: Type.FilePath) => {
    this.file = file
  }

  private format?: Type.LoadVarStep['format']

  /**
   * Sets how to parse the file contents. Options are 'raw', 'trim', 'yaml',
   * or 'json'. Defaults to 'trim' which removes leading/trailing whitespace.
   *
   * https://concourse-ci.org/docs/steps/load-var/#load_var-step
   *
   * @param {Type.LoadVarStep['format']} format The format to parse as
   */
  public set_format = (format: Type.LoadVarStep['format']) => {
    this.format = format
  }

  private reveal: boolean

  /**
   * Sets "reveal" to true - avoid calling to keep false
   *
   * https://concourse-ci.org/docs/steps/load-var/#load_var-step
   */
  public set_reveal = () => {
    this.reveal = true
  }

  /**
   * Returns a var reference string for use in subsequent steps. The returned
   * string can be interpolated into other step configurations.
   *
   * @returns {string} The var reference in ((.:var_name)) format
   */
  public get var() {
    return get_var(`.:${this.load_var}`)
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
   * @returns {Type.LoadVarStep} The serialised load_var step configuration
   */
  public serialise() {
    const result: Type.LoadVarStep = {
      ...this.serialise_base(),
      load_var: get_identifier(this.load_var),
      file: this.file,
      format: this.format,
      reveal: this.reveal,
    }

    return result
  }
}
