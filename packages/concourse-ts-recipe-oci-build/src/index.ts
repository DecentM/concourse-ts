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
    task.platform = 'linux'

    task.customise_task_step((task_step) => {
      task_step.privileged = true
    })

    task.set_image_resource({
      type: 'registry-image',
      source: {
        repository: input.oci_build_task_repository ?? 'concourse/oci-build-task',
        tag: input.oci_build_task_tag ?? 'latest',
      },
    })

    task.set_params({
      key: 'CONTEXT',
      value: input.resource.name,
    })

    if (input.options?.output_oci) {
      task.set_params({
        key: 'OUTPUT_OCI',
        value: 'true',
      })
    }

    if (input.options?.unpack_rootfs) {
      task.set_params({
        key: 'UNPACK_ROOTFS',
        value: 'true',
      })
    }

    if (input.options?.build_args_file) {
      task.set_params({
        key: 'BUILD_ARGS_FILE',
        value: input.options.build_args_file,
      })
    }

    if (input.options?.buildkit_ssh) {
      task.set_params({
        key: 'BUILDKIT_SSH',
        value: input.options.buildkit_ssh,
      })
    }

    if (input.options?.dockerfile) {
      task.set_params({
        key: 'DOCKERFILE',
        value: input.options.dockerfile,
      })
    }

    if (input.options?.image_platform && input.options.image_platform.length) {
      task.set_params({
        key: 'IMAGE_PLATFORM',
        value: input.options.image_platform.join(','),
      })
    }

    if (input.options?.target) {
      task.set_params({
        key: 'TARGET',
        value: input.options.target,
      })
    }

    if (input.options?.target_file) {
      task.set_params({
        key: 'TARGET_FILE',
        value: input.options.target_file,
      })
    }

    if (
      input.options.additional_targets &&
      input.options.additional_targets.length
    ) {
      task.set_params({
        key: 'ADDITIONAL_TARGETS',
        value: input.options.additional_targets.join(','),
      })
    }

    if (input.options?.build_args) {
      Object.entries(input.options.build_args).forEach(([key, value]) => {
        task.set_params({ key: `BUILD_ARG_${key}`, value })
      })
    }

    if (input.options?.buildkit_secret) {
      Object.entries(input.options.buildkit_secret).forEach(([key, value]) => {
        task.set_params({ key: `BUILDKIT_SECRET_${key}`, value })
      })
    }

    if (input.options?.buildkit_secrettext) {
      Object.entries(input.options.buildkit_secrettext).forEach(([key, value]) => {
        task.set_params({ key: `BUILDKIT_SECRETTEXT_${key}`, value })
      })
    }

    if (input.options?.image_arg) {
      Object.entries(input.options.image_arg).forEach(([key, value]) => {
        task.set_params({ key: `IMAGE_ARG_${key}`, value })
      })
    }

    if (input.options?.label) {
      Object.entries(input.options.label).forEach(([key, value]) => {
        task.set_params({ key: `LABEL_${key}`, value })
      })
    }

    if (input.options?.labels_file) {
      task.set_params({
        key: 'LABELS_FILE',
        value: input.options.labels_file,
      })
    }

    if (input.options?.registry_mirrors && input.options?.registry_mirrors.length) {
      task.set_params({
        key: 'REGISTRY_MIRRORS',
        value: input.options.registry_mirrors.join(','),
      })
    }

    task.add_input({
      name: input.resource.name,
    })

    task.add_output({
      name: 'image',
    })

    task.add_cache({
      path: 'cache',
    })

    task.run = new ConcourseTs.Command((command) => {
      command.path = '/usr/bin/build'
    })

    if (customise) {
      customise(task)
    }
  }
