import { Duration } from '../utils/duration/index.js'
import { Identifier } from '../utils/identifier/index.js'

export type Config = Record<string, YamlValue>
export type Version = 'latest' | 'every' | Record<string, string>
export type DirPath = string
export type FilePath = string
export type EnvVars = Record<string, string>
export type Vars = Record<string, YamlValue>
export type Tags = string[]

export type YamlValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | YamlValue[]
  | { [key in string]: YamlValue }

/**
 * JSON representation of {@link ResourceType:class}
 *
 * https://concourse-ci.org/docs/resource-types/
 */
export type ResourceType = {
  name: Identifier
  type: Identifier
  source: Config
  privileged?: boolean
  params?: Config
  check_every?: Duration
  tags?: Tags
  defaults?: Config
}

/**
 * JSON representation of {@link Resource:class}
 *
 * https://concourse-ci.org/docs/resources/
 */
export type Resource = {
  name: Identifier
  type: ResourceType['name']
  source: Config
  old_name?: Identifier
  icon?: string
  version?: Version
  check_every?: Duration | 'never'
  check_timeout?: Duration
  expose_build_created_by?: boolean
  tags?: Tags
  public?: boolean
  webhook_token?: string
}

/**
 * A name-less version of {@link Resource}
 *
 * Used by {@link Task}
 *
 * https://concourse-ci.org/docs/tasks/#task-config-schema
 */
export type AnonymousResource<AnonymousIdentifier extends string = Identifier> = {
  type: AnonymousIdentifier
  source: Config
  params?: Config
  version?: Version
}

/**
 * JSON representation of {@link Command:class}
 *
 * Used by {@link Task}
 *
 * https://concourse-ci.org/docs/tasks/#command-schema
 */
export type Command = {
  path: FilePath
  args?: string[]
  dir?: DirPath
  user?: string
}

/**
 * https://concourse-ci.org/docs/tasks/#task-config-schema
 *
 * Used by {@link Task}
 */
export type TaskCache = {
  path: DirPath
}

/**
 * https://concourse-ci.org/docs/tasks/#container_limits-schema
 *
 * Used by {@link Task}
 */
export type ContainerLimits = {
  cpu?: number
  memory?: number
}

/**
 * https://concourse-ci.org/docs/tasks/#task-config-schema
 *
 * Used by {@link Task}
 */
export type Platform = 'linux' | 'darwin' | 'windows'

/**
 * JSON representation of {@link Task:class}
 *
 * https://concourse-ci.org/docs/tasks/
 */
export type Task<Input extends Identifier, Output extends Identifier> = {
  platform: Platform
  image_resource: AnonymousResource
  run: Command
  inputs?: TaskInput<Input>[]
  outputs?: TaskOutput<Output>[]
  caches?: TaskCache[]
  params?: EnvVars
  rootfs_uri?: string
  container_limits?: ContainerLimits
}

/**
 * https://concourse-ci.org/docs/steps/modifier-and-hooks/across/#across-step-modifier
 */
export type Across<IdentifierType extends string = Identifier> = {
  var: IdentifierType
  values: string[]
  max_in_flight?: 'all' | number
  fail_fast?: boolean
}

/**
 * Common members held by all steps.
 *
 * https://concourse-ci.org/docs/steps/
 */
export type StepBase = {
  timeout?: Duration
  attempts?: number
  tags?: Tags
  on_success?: Step
  on_failure?: Step
  on_error?: Step
  on_abort?: Step
  ensure?: Step
  across?: Across[]
}

/**
 * https://concourse-ci.org/docs/steps/get/
 */
export type GetStep = {
  get: Identifier
  resource?: Identifier
  passed?: Identifier[]
  params?: Config
  trigger?: boolean
  version?: Version
} & StepBase

/**
 * https://concourse-ci.org/docs/steps/put/#put-step
 */
export type Inputs = 'detect' | 'all' | Identifier[]

/**
 * https://concourse-ci.org/docs/steps/put/
 */
export type PutStep = {
  put: Identifier
  resource?: Identifier
  inputs?: Inputs
  params?: Config
  get_params?: Config
  no_get?: boolean
} & StepBase

/**
 * https://concourse-ci.org/docs/tasks/#input-schema
 *
 * TransferType is for specifying input and output names to keep user codebase
 * type-safe.
 */
export type TaskInput<TransferType extends string> = {
  name: TransferType
  path?: DirPath
  optional?: boolean
}

/**
 * https://concourse-ci.org/docs/tasks/#output-schema
 */
export type TaskOutput<TransferType extends string> = {
  name: TransferType
  path?: DirPath
}

/**
 * https://concourse-ci.org/docs/steps/task/
 */
export type TaskStep<
  Input extends Identifier = Identifier,
  Output extends Identifier = Identifier,
> = {
  task: Identifier
  config?: Task<Input, Output>
  file?: FilePath
  image?: Identifier
  privileged?: boolean
  vars?: Vars
  params?: EnvVars
  input_mapping?: Record<Input, Identifier>
  output_mapping?: Record<Output, Identifier>
} & StepBase

/**
 * https://concourse-ci.org/docs/steps/set-pipeline/
 */
export type SetPipelineStep = {
  set_pipeline: Identifier | 'self'
  file: FilePath
  instance_vars?: Vars
  vars?: Vars
  var_files?: FilePath[]
  team?: Identifier
} & StepBase

/**
 * https://concourse-ci.org/docs/steps/load-var/#load_var-step
 */
export type LoadVarStep = {
  load_var: Identifier
  file: FilePath
  format?: 'json' | 'yaml' | 'yml' | 'trim' | 'raw'
  reveal?: boolean
} & StepBase

export type InParallelConfig = {
  steps: Step[]
  limit?: number
  fail_fast?: boolean
}

/**
 * https://concourse-ci.org/docs/steps/in-parallel/
 */
export type InParallelStep = {
  in_parallel: Step[] | InParallelConfig
} & StepBase

/**
 * https://concourse-ci.org/docs/steps/do/
 */
export type DoStep = {
  do: Step[]
} & StepBase

/**
 * https://concourse-ci.org/docs/steps/try/
 */
export type TryStep = {
  try: Step
} & StepBase

/**
 * Matches any step type. Use get_step_type to discriminate between steps.
 */
export type Step =
  | GetStep
  | PutStep
  | TaskStep
  | SetPipelineStep
  | LoadVarStep
  | InParallelStep
  | DoStep
  | TryStep

/**
 * https://concourse-ci.org/docs/jobs/#build_log_retention_policy-schema
 */
export type BuildLogRetentionPolicy = {
  days?: number
  builds?: number
  minimum_succeeded_builds?: number
}

/**
 * https://concourse-ci.org/docs/jobs/
 */
export type Job = {
  name: Identifier
  plan: Step[]
  old_name?: Identifier
  serial?: boolean
  serial_groups?: Identifier[]
  max_in_flight?: number
  build_log_retention?: BuildLogRetentionPolicy
  build_logs_to_retain?: number
  public?: boolean
  disable_manual_trigger?: boolean
  interruptible?: boolean
  on_success?: Step
  on_failure?: Step
  on_error?: Step
  on_abort?: Step
  ensure?: Step
}

type VarSourceBase = {
  name: string
}

type VarSourceVault = VarSourceBase & {
  type: 'vault'
  config: {
    url: string
    ca_cert?: string
    path_prefix?: string
    lookup_templates?: string[]
    shared_path?: string
    namespace?: string
    client_cert?: string
    client_key?: string
    server_name?: string
    insecure_skip_verify?: boolean
    client_token?: string
    auth_backend?: string
    auth_params?: Record<string, string>
    auth_max_ttl?: Duration
    auth_retry_max?: Duration
    auth_retry_initial?: Duration
  }
}

type VarSourceDummy = VarSourceBase & {
  type: 'dummy'
  config: {
    vars: Vars
  }
}

type VarSourceSsm = VarSourceBase & {
  type: 'ssm'
  config: {
    region: string
  }
}

type VarSourceSecretsManager = VarSourceBase & {
  type: 'secretsmanager'
  config: {
    'aws-secretsmanager-access-key'?: string
    'aws-secretsmanager-secret-key'?: string
    'aws-secretsmanager-session-token'?: string
    'aws-secretsmanager-region'?: string
    'aws-secretsmanager-pipeline-secret-template'?: string
    'aws-secretsmanager-team-secret-template'?: string
  }
}

/**
 * https://concourse-ci.org/docs/vars/#var-sources-experimental
 */
export type VarSource =
  | VarSourceDummy
  | VarSourceVault
  | VarSourceSsm
  | VarSourceSecretsManager

type GroupConfig<GroupName extends Identifier = Identifier> = {
  name: GroupName
  jobs?: Job['name'][]
}

type DisplayConfig = {
  background_image?: string
  background_filter?: string
}

/**
 * https://concourse-ci.org/docs/pipelines/
 */
export type Pipeline = {
  jobs: Job[]
  resources?: Resource[]
  resource_types?: ResourceType[]
  var_sources?: VarSource[]
  groups?: GroupConfig[]
  display?: DisplayConfig
}
