import * as ConcourseTs from '@decentm/concourse-ts'

export type OciBuildTaskInput = {
  resource: ConcourseTs.Resource
  /**
   * Default: `concourse/oci-build-task`
   */
  oci_build_task_repository?: string
  /**
   * https://hub.docker.com/r/concourse/oci-build-task/tags
   */
  oci_build_task_tag?: string
  options?: {
    dockerfile?: string
    build_args?: Record<string, string>
    build_args_file?: string
    buildkit_secret?: Record<string, string>
    buildkit_secrettext?: Record<string, ConcourseTs.Utils.Var>
    image_arg?: Record<string, string>
    image_platform?: string[]
    label?: Record<string, string>
    labels_file?: string
    target?: string
    target_file?: string
    additional_targets?: string[]
    buildkit_ssh?: string
    registry_mirrors?: string[]
    unpack_rootfs?: boolean
    output_oci?: boolean
  }
}

export const create_oci_build =
  (input: OciBuildTaskInput): ConcourseTs.Type.Recipe<ConcourseTs.Task> =>
  (customise) =>
  (task) => {
    task.set_platform('linux')

    task.customise_task_step((task_step) => {
      task_step.set_privileged()
    })

    task.set_image_resource({
      type: 'registry-image',
      source: {
        repository: input.oci_build_task_repository ?? 'concourse/oci-build-task',
        tag: input.oci_build_task_tag ?? 'latest',
      },
    })

    const input_resource = input.resource.serialise()

    task.set_params({ CONTEXT: input_resource.name })

    if (input.options?.output_oci) {
      task.set_params({ OUTPUT_OCI: 'true' })
    }

    if (input.options?.unpack_rootfs) {
      task.set_params({ UNPACK_ROOTFS: 'true' })
    }

    if (input.options?.build_args_file) {
      task.set_params({ BUILD_ARGS_FILE: input.options.build_args_file })
    }

    if (input.options?.buildkit_ssh) {
      task.set_params({ BUILDKIT_SSH: input.options.buildkit_ssh })
    }

    if (input.options?.dockerfile) {
      task.set_params({ DOCKERFILE: input.options.dockerfile })
    }

    if (input.options?.image_platform && input.options.image_platform.length) {
      task.set_params({ IMAGE_PLATFORM: input.options.image_platform.join(',') })
    }

    if (input.options?.target) {
      task.set_params({ TARGET: input.options.target })
    }

    if (input.options?.target_file) {
      task.set_params({ TARGET_FILE: input.options.target_file })
    }

    if (
      input.options.additional_targets &&
      input.options.additional_targets.length
    ) {
      task.set_params({
        ADDITIONAL_TARGETS: input.options.additional_targets.join(','),
      })
    }

    if (input.options?.build_args) {
      Object.entries(input.options.build_args).forEach(([key, value]) => {
        task.set_params({ [`BUILD_ARG_${key}`]: value })
      })
    }

    if (input.options?.buildkit_secret) {
      Object.entries(input.options.buildkit_secret).forEach(([key, value]) => {
        task.set_params({ [`BUILDKIT_SECRET_${key}`]: value })
      })
    }

    if (input.options?.buildkit_secrettext) {
      Object.entries(input.options.buildkit_secrettext).forEach(([key, value]) => {
        task.set_params({ [`BUILDKIT_SECRETTEXT_${key}`]: value })
      })
    }

    if (input.options?.image_arg) {
      Object.entries(input.options.image_arg).forEach(([key, value]) => {
        task.set_params({ [`IMAGE_ARG_${key}`]: value })
      })
    }

    if (input.options?.label) {
      Object.entries(input.options.label).forEach(([key, value]) => {
        task.set_params({ [`LABEL_${key}`]: value })
      })
    }

    if (input.options?.labels_file) {
      task.set_params({ LABELS_FILE: input.options.labels_file })
    }

    if (input.options?.registry_mirrors && input.options?.registry_mirrors.length) {
      task.set_params({ REGISTRY_MIRRORS: input.options.registry_mirrors.join(',') })
    }

    task.add_input({
      name: input_resource.name,
    })

    task.add_output({
      name: 'image',
    })

    task.add_cache({
      path: 'cache',
    })

    task.set_run(new ConcourseTs.Command((command) => {
      command.set_path('/usr/bin/build')
    }))

    if (customise) {
      customise(task)
    }
  }
