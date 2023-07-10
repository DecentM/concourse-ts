import * as ConcourseTs from '@decentm/concourse-ts'

export type AutoPipelineOptions<Group extends string = never> = {
  /**
   * A Resource that contains at least one valid concourse-ts pipeline file
   */
  resource: ConcourseTs.Resource
  /**
   * The path inside the resource that points to one concourse-ts pipeline file.
   * Relative to the resource root.
   */
  path: string
  /**
   * If set, the resulting job will be added to the pipeline in this group
   */
  group?: Group
  /**
   * This version of the concourse-ts-cli image will be used
   *
   * https://hub.docker.com/r/decentm/concourse-ts-cli/tags
   */
  cli_tag: string
}

const create_cli_command_task = <Group extends string = never>(
  input: ConcourseTs.Utils.Identifier,
  options: AutoPipelineOptions<Group>,
  command: ConcourseTs.Command
) => {
  return new ConcourseTs.Task('compile', (task) => {
    task.platform = 'linux'

    task.add_input({
      name: input,
    })

    task.add_output({
      name: 'output',
    })

    task.set_image_resource({
      type: 'registry-image',
      source: {
        repository: 'decentm/concourse-ts-cli',
        tag: options.cli_tag,
      },
    })

    task.run = command
  })
}

export const create_auto_pipeline =
  <Group extends string = never>(
    options: AutoPipelineOptions<Group>
  ): ConcourseTs.Type.Recipe<ConcourseTs.Pipeline<Group>> =>
  (customise) =>
  (pipeline) => {
    const get_resource_step = options.resource.as_get_step({
      trigger: true,
    })

    const compile_command = new ConcourseTs.Command('compile', (command) => {
      command.dir = options.resource.name

      command.path = 'concourse-ts'

      // Turn Typescript into YAML
      command.add_arg('compile')

      // Input path
      command.add_arg('-i')
      command.add_arg(options.path)

      // Output path
      command.add_arg('-o')
      command.add_arg('../output')
    })

    const transform_command = new ConcourseTs.Command('transform', (command) => {
      command.dir = '.'

      command.path = 'concourse-ts'

      // Run transforms over the pipeline
      command.add_arg('transform')

      // Input path
      command.add_arg('-i')
      command.add_arg('../output/pipeline/*.yml')

      // Output path
      command.add_arg('-o')
      command.add_arg('../output/pipeline')
    })

    const compile_and_transform = ConcourseTs.Utils.join_commands(
      'compile-and-transform',
      (args, command) => {
        command.path = '/bin/sh'
        command.add_arg('-exuc')

        command.add_arg(args.join(' && '))
      },
      compile_command,
      transform_command
    )

    const compile_task = create_cli_command_task(
      ConcourseTs.Utils.get_identifier(options.resource.name),
      options,
      compile_and_transform
    )

    const set_pipeline_step = new ConcourseTs.SetPipelineStep(
      'set-pipeline',
      (step) => {
        step.set_pipeline = pipeline
        step.file = `output/pipeline/${pipeline.name}.yml`
      }
    )

    const auto_pipeline_job = new ConcourseTs.Job('auto-pipeline', (job) => {
      job.max_in_flight = 1

      job.add_step(get_resource_step)
      job.add_step(compile_task.as_task_step())
      job.add_step(set_pipeline_step)
    })

    if (customise) {
      customise(pipeline)
    }

    pipeline.add_job(auto_pipeline_job, options.group)
  }
