export type Identifier = string
export type Config = Record<string, any>
export type Version = Record<string, string>
export type DirPath = string
export type FilePath = string
export type EnvVars = Record<string, string>
export type Vars = Record<string, string>
export type Tags = string[]

export type Duration = string & {__type: 'Duration'}

// https://pkg.go.dev/time#ParseDuration
export const VALID_DURATION_UNITS = ['ns', 'us', 'µs', 'ms', 's', 'm', 'h']

export const is_duration = (input: string): input is Duration => {
  const DURATION_RX = /^[0-9]{0,}(ns|us|µs|ms|s|m|h)$/gu

  return !!DURATION_RX.exec(input)
}

export type ResourceType = {
  name: Identifier
  type: Identifier
  source: Config
  privileged?: boolean
  params?: Config
  check_every?: Duration
  tags?: Tags
  unique_version_history?: boolean
  defaults?: Config
}

export type Resource = {
  name: Identifier
  type: ResourceType['name']
  source: Config
  old_name?: Identifier
  icon?: string
  version?: Version
  check_every?: Duration | 'never'
  tags?: Tags
  public?: boolean
  webhook_token?: string
}

export type AnonymousResource = {
  type: ResourceType['name']
  source: Config
  params?: Config
  version?: Version
}

export type Command = {
  path: FilePath
  args?: string[]
  dir?: DirPath
  user?: string
}

export type TaskCache = {
  path: DirPath
}

export type ContainerLimits = {
  cpu?: number
  memory?: number
}

export type Platform = 'linux' | 'darwin' | 'windows'

export type Task = {
  platform: Platform
  image_resource: AnonymousResource
  run: Command
  inputs?: TaskInput[]
  outputs?: TaskOutput[]
  caches?: TaskCache[]
  params?: EnvVars
  rootfs_uri?: string
  container_limits?: ContainerLimits
}

type StepBase = {
  timeout?: Duration
  attempts?: number
  tags?: Tags
  on_success?: Step
  on_failure?: Step
  on_error?: Step
  on_abort?: Step
  ensure?: Step
}

export type GetStep = {
  get: Identifier | Resource['name']
  resource?: Resource['name']
  passed?: Job['name'][]
  params?: Config
  trigger?: boolean
  version?: 'latest' | 'every' | Version
} & StepBase

export type PutStep = {
  put: Identifier | Resource['name']
  resource?: Resource['name']
  inputs?: 'detect' | 'all' | Identifier[]
  params?: Config
  get_params?: Config
} & StepBase

export type TaskInput = {
  name: Identifier
  path?: DirPath
  optional?: boolean
}

export type TaskOutput = {
  name: Identifier
  path?: DirPath
}

export type TaskStep = {
  task: Identifier
  config?: Task
  file?: FilePath
  image?: Identifier
  privileged?: boolean
  vars?: Vars
  params?: EnvVars
  input_mapping?: Record<TaskInput['name'], Identifier>
  output_mapping?: Record<TaskOutput['name'], Identifier>
} & StepBase

export type SetPipelineStep = {
  set_pipeline: Identifier | 'self'
  file: FilePath
  instance_vars?: Vars
  vars?: Vars
  var_files?: FilePath[]
  team?: Identifier
} & StepBase

export type LoadVarStep = {
  load_var: Identifier
  file: FilePath
  format?: 'json' | 'yaml' | 'yml' | 'trim' | 'raw'
  reveal?: boolean
} & StepBase

type InParallelConfig = {
  steps: Step[]
  limit?: number
  fail_fast?: boolean
}

export type InParallelStep = {
  in_parallel: Step[] | InParallelConfig
} & StepBase

export type DoStep = {
  do: Step[]
} & StepBase

export type TryStep = {
  try: Step
} & StepBase

export type Step =
  | GetStep
  | PutStep
  | TaskStep
  | SetPipelineStep
  | LoadVarStep
  | InParallelStep
  | DoStep
  | TryStep

export type BuildLogRetentionPolicy = {
  days?: number
  builds?: number
  minimum_succeeded_builds?: number
}

export type Job = {
  name: Identifier
  plan: Step[]
  old_name?: Identifier
  serial?: boolean
  build_log_retention?: BuildLogRetentionPolicy
  build_logs_to_retain?: number
  serial_groups?: Identifier
  max_in_flight?: number
  public?: boolean
  disable_manual_trigger?: boolean
  interruptible?: boolean
  on_success?: DoStep // These are actually "Step"s in Concourse,
  on_failure?: DoStep // but we interpret it as DoStep to make it
  on_error?: DoStep // easier to work with a step type
  on_abort?: DoStep // that's always an array
  ensure?: Step
}

type VaultConfig = {
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

type VarSourceBase = {
  name: string
}

type VarSourceVault = VarSourceBase & {
  type: 'vault'
  config: VaultConfig
}

type DummyConfig = {
  vars: Vars
}

type VarSourceDummy = VarSourceBase & {
  type: 'dummy'
  config: DummyConfig
}

export type VarSource = VarSourceDummy | VarSourceVault

export type GroupConfig = {
  name: Identifier
  jobs?: Job['name']
}

export type DisplayConfig = {
  background_image?: string
}

export type Pipeline = {
  jobs: Job[]
  resources?: Resource[]
  resource_types?: ResourceType[]
  var_sources?: VarSource[]
  groups?: GroupConfig[]
  display?: DisplayConfig
}
