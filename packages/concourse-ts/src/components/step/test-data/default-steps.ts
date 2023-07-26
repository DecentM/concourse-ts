export const default_step = {
  attempts: undefined,
  ensure: undefined,
  on_abort: undefined,
  on_error: undefined,
  on_failure: undefined,
  on_success: undefined,
  tags: undefined,
  timeout: undefined,
  across: undefined,
}

export const default_get_step = {
  ...default_step,
  get: 'r',
  params: undefined,
  passed: undefined,
  resource: undefined,
  timeout: undefined,
  trigger: undefined,
  version: undefined,
}

export const default_task_step = {
  ...default_step,
  config: undefined,
  file: undefined,
  image: undefined,
  input_mapping: undefined,
  output_mapping: undefined,
  params: undefined,
  privileged: undefined,
  task: undefined,
  vars: undefined,
}

export const default_task_step_config = {
  caches: undefined,
  container_limits: undefined,
  image_resource: undefined,
  inputs: undefined,
  outputs: undefined,
  params: undefined,
  platform: 'linux',
  rootfs_uri: undefined,
  run: undefined,
}

export const default_task_step_with_config = {
  ...default_task_step,
  config: default_task_step_config,
}

export const default_task = {
  caches: undefined,
  container_limits: undefined,
  image_resource: undefined,
  inputs: undefined,
  outputs: undefined,
  params: undefined,
  platform: undefined,
  rootfs_uri: undefined,
  run: undefined,
}

export const default_in_parallel_step = {
  ...default_step,
  in_parallel: {
    fail_fast: undefined,
    limit: undefined,
    steps: [],
  },
}

export const default_load_var_step = {
  ...default_step,
  file: undefined,
  format: undefined,
  load_var: undefined,
  reveal: undefined,
}

export const default_put_step = {
  ...default_step,
  get_params: undefined,
  inputs: undefined,
  params: undefined,
  put: undefined,
  resource: undefined,
  no_get: undefined,
}

export const default_set_pipeline_step = {
  ...default_step,
  team: undefined,
  var_files: undefined,
  vars: undefined,
  set_pipeline: undefined,
  file: undefined,
  instance_vars: undefined,
}

export const default_try_step = {
  ...default_step,
  try: undefined,
}

export const default_do_step = {
  ...default_step,
  do: [],
}

export const default_job = {
  max_in_flight: undefined,
  plan: [],
  build_log_retention: undefined,
  build_logs_to_retain: undefined,
  disable_manual_trigger: undefined,
  ensure: undefined,
  interruptible: undefined,
  old_name: undefined,
  on_abort: undefined,
  on_error: undefined,
  on_failure: undefined,
  on_success: undefined,
  public: undefined,
  serial: undefined,
  serial_groups: undefined,
}

export const default_pipeline = {
  display: undefined,
  groups: undefined,
  jobs: [],
  resource_types: undefined,
  resources: undefined,
  var_sources: undefined,
}
