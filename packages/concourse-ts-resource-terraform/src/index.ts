import * as ConcourseTs from '@decentm/concourse-ts'
import * as RegistryImage from '@decentm/concourse-ts-resource-registry-image'

type Source = {
  /**
   * The name of the [Terraform
   * backend](https://www.terraform.io/docs/backends/types/index.html) the
   * resource will use to store statefiles, e.g. `s3` or `consul`.
   *
   * > **Note:** The 'local' backend type is not supported, Concourse requires
   * > that state is persisted outside the container
   */
  backend_type: string
  /**
   *  A map of key-value configuration options specific to your choosen backend,
   *  e.g. [S3
   *  options](https://www.terraform.io/docs/backends/types/s3.html#configuration-variables).
   */
  backend_config: Record<string, string>
  /**
   * Name of the environment to manage, e.g. `staging`. A [Terraform
   * workspace](https://www.terraform.io/docs/state/workspaces.html) will be
   * created with this name. See [Single vs
   * Pool](#managing-a-single-environment-vs-a-pool-of-environments) section
   * below for more options.
   */
  env_name?: string
  /**
   * Default `false`. If true, the resource will run `terraform destroy` if
   * `terraform apply` returns an error.
   */
  delete_on_failure?: boolean
  /**
   * A collection of Terraform input variables.
   *
   * These are typically used to specify credentials or override default module
   * values. See [Terraform Input
   * Variables](https://www.terraform.io/language/values/variables) for more
   * details.
   */
  vars?: Record<string, string>
  /**
   * Similar to `vars`, this collection of key-value pairs can be used to pass
   * environment variables to Terraform, e.g. "AWS_ACCESS_KEY_ID".
   */
  env?: Record<string, string>
  /**
   * An SSH key used to fetch modules, e.g. [private GitHub
   * repos](https://www.terraform.io/docs/modules/sources.html#private-github-repos).
   */
  private_key?: ConcourseTs.Utils.Var
}

type GetParams = {
  /**
   * Default `false`. If true, the resource writes the Terraform statefile to a
   * file named `terraform.tfstate`.**Warning:** Ensure any changes to this
   * statefile are persisted back to the resource's storage bucket. **Another
   * warning:** Some statefiles contain unencrypted secrets, be careful not to
   * expose these in your build logs.
   */
  output_statefile?: boolean
  /**
   * Default `false`. If true a file named `plan.json` with the JSON
   * representation of the Terraform binary plan file will be created.
   */
  output_planfile?: boolean
  /**
   * Write only the outputs from the given module name to the `metadata` file.
   */
  output_module?: string
}

type EnvName = {
  /**
   * *See Note.*
   * The name of the environment to create or modify. A [Terraform
   * workspace](https://www.terraform.io/docs/state/workspaces.html) will be
   * created with this name. Multiple environments can be managed with a single
   * resource.
   *
   * > Note: You must specify one of the following options: `source.env_name`,
   * > `put.params.env_name`, `put.params.generate_random_name`, or
   * > `env_name_file`
   */
  env_name: string
  env_name_file?: undefined
  generate_random_name?: undefined
}

type EnvNameFile = {
  env_name?: undefined
  /**
   * *See Note.*
   * Reads the `env_name` from a specified file path. Useful for destroying
   * environments from a lock file.
   *
   * > Note: You must specify one of the following options: `source.env_name`,
   * > `put.params.env_name`, `put.params.generate_random_name`, or
   * > `env_name_file`
   */
  env_name_file: string
  generate_random_name?: undefined
}

type GenerateRandomName = {
  env_name?: undefined
  env_name_file?: undefined
  /**
   * *See Note.*
   * Default `false`. Generates a random `env_name` (e.g. "coffee-bee"). See
   * [Single vs Pool](#managing-a-single-environment-vs-a-pool-of-environments)
   * section below.
   *
   * > Note: You must specify one of the following options: `source.env_name`,
   * > `put.params.env_name`, `put.params.generate_random_name`, or
   * > `env_name_file`
   */
  generate_random_name: true
}

/**
 * Source may also have the env_name, in which case none of these options need
 * to be specified. This case is not type-checked.
 */
type EnvNameInSource = {
  env_name?: undefined
  env_name_file?: undefined
  generate_random_name?: undefined
}

type PutParams = (EnvName | EnvNameFile | GenerateRandomName | EnvNameInSource) & {
  /**
   * The relative path of the directory containing your Terraform configuration
   * files. For example: if your `.tf` files are stored in a git repo called
   * `prod-config` under a directory `terraform-configs`, you could do a `get:
   * prod-config` in your pipeline with `terraform_source:
   * prod-config/terraform-configs/` as the source.
   */
  terraform_source: string
  /**
   * Default `false`
   *
   * See description under `source.delete_on_failure`.
   */
  delete_on_failure?: boolean
  /**
   * A collection of Terraform input variables. See description under
   * `source.vars`.
   */
  vars?: Record<string, string>
  /**
   * A list of files containing Terraform input variables. These files can be
   * in YAML or JSON format, or HCL if the filename ends in `.tfvars`. >
   * Terraform variables will be merged from the following locations in
   * increasing order of precedence: `source.vars`, `put.params.vars`, and
   * `put.params.var_files`. Finally, `env_name` is automatically passed as an
   * input `var`.
   */
  var_files?: string[]
  /**
   * A key-value collection of environment variables to pass to Terraform. See
   * description under `source.env`.
   */
  env?: Record<string, string>
  /**
   * An SSH key used to fetch modules, e.g. [private GitHub
   * repos](https://www.terraform.io/docs/modules/sources.html#private-github-repos).
   */
  private_key?: ConcourseTs.Utils.Var
  /**
   * Default `false`
   *
   * This boolean will allow Terraform to create a plan file and store it the
   * configured backend. Useful for manually reviewing a plan prior to applying.
   * See [Plan and Apply Example](#plan-and-apply-example). **Warning:** Plan
   * files contain unencrypted credentials like AWS Secret Keys, only store
   * these files in a private bucket.
   */
  plan_only?: boolean
  /**
   * Default `false`
   *
   * This boolean will allow Terraform to execute the plan file stored on the
   * configured backend, then delete it.
   */
  plan_run?: boolean
  /**
   * A list of files containing existing resources to
   * [import](https://www.terraform.io/docs/import/usage.html) into the state
   * file. The files can be in YAML or JSON format, containing key-value pairs
   * like `aws_instance.bar: i-abcd1234`.
   */
  import_files?: string[]
  /**
   * A list of files to copy into the `terraform_source` directory. Override
   * files must follow conventions outlined
   * [here](https://www.terraform.io/docs/configuration/override.html) such as
   * file names ending in `_override.tf`.
   */
  override_files?: string[]
  /**
   * A list of maps to copy override files to specific destination directories.
   * Override files must follow conventions outlined
   * [here](https://www.terraform.io/docs/configuration/override.html) such as
   * file names ending in `_override.tf`. The source file is specified with
   * `src` and the destination directory with `dst`.
   */
  module_override_files?: string[]
  /**
   * When set to `destroy`, the resource will run `terraform destroy` against
   * the given statefile. > **Note:** You must also set `put.get_params.action`
   * to `destroy` to ensure the task succeeds. This is a temporary workaround
   * until Concourse adds support for `delete` as a first-class operation. See
   * [this issue](https://github.com/concourse/concourse/issues/362) for more
   * details.
   */
  action?: string
  /**
   * The path (relative to your `terraform_source`) of the directory containing
   * plugin binaries. This overrides the default plugin directory and Terraform
   * will not automatically fetch built-in plugins if this option is used. To
   * preserve the automatic fetching of plugins, omit `plugin_dir` and place
   * third-party plugins in `${terraform_source}/terraform.d/plugins`. See
   * https://www.terraform.io/docs/configuration/providers.html#third-party-plugins
   * for more information.
   */
  plugin_dir?: string
  /**
   * Default `10`
   *
   * This int limit the number of concurrent operations Terraform will perform.
   * See the [Terraform
   * docs](https://www.terraform.io/docs/cli/commands/apply.html#parallelism-n)
   * for more information.
   */
  parallelism?: number
  /**
   * Default `0s`
   *
   * Duration to retry a state lock. See the [Terraform
   * docs](https://www.terraform.io/cli/commands/apply#lock-timeout-duration)
   * for more information.
   */
  lock_timeout?: ConcourseTs.Utils.Duration
}

export type Resource = ConcourseTs.Resource<Source, PutParams, GetParams, 'registry-image', RegistryImage.Source<'ljfranklin/terraform-resource'>>

export type ResourceType = ConcourseTs.ResourceType<
  'registry-image',
  RegistryImage.Source<'ljfranklin/terraform-resource'>
>
