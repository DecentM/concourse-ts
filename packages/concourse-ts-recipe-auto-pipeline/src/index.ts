import * as ConcourseTs from '@decentm/concourse-ts'

export enum AutoPipelineCompilation {
  Local,
  Docker,
}

export type AutoPipelineOptions<Group extends string = never> = {
  /**
   * A Resource that contains at least one valid concourse-ts pipeline file
   */
  // Doesn't matter what kind of resource it is, we just need some yamls from it
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  resource: ConcourseTs.Resource<any, any, any, string, any>
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
  cli_tag?: string
}

const create_cli_command_task = <Group extends string = never>(
  input: ConcourseTs.Utils.Identifier,
  options: AutoPipelineOptions<Group>,
  command: ConcourseTs.Command
) => {
  return new ConcourseTs.Task('compile', (task) => {
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

    task.set_run(command)
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

    const resource = options.resource.serialise()

    const compile_command = new ConcourseTs.Command((command) => {

      command.set_dir(resource.name)

      command.set_path('concourse-ts')

      // Turn Typescript into YAML
      command.add_args('compile')

      // Input path
      command.add_args('-i')
      command.add_args(options.path)

      // Output path
      command.add_args('-o')
      command.add_args('../output')
    })

    const transform_command = new ConcourseTs.Command((command) => {
      command.set_path('concourse-ts')

      // Run transforms over the pipeline
      command.add_args('transform')

      // Input path
      command.add_args('-i')
      command.add_args('../output/pipeline/*.yml')

      // Output path
      command.add_args('-o')
      command.add_args('../output/pipeline')
    })

    const compile_and_transform = ConcourseTs.Utils.join_commands(
      (args, command) => {
        command.set_path('/bin/sh')
        command.add_args('-exuc')

        command.add_args(args.join(' && '))
      },
      compile_command,
      transform_command
    )

    const compile_task = create_cli_command_task(
      ConcourseTs.Utils.get_identifier(resource.name),
      options,
      compile_and_transform
    )

    const set_compiled_pipeline_step = new ConcourseTs.SetPipelineStep(
      'set-compiled-pipeline',
      (step) => {
        step.set_pipeline(pipeline)
        step.set_file(`output/pipeline/${pipeline.name}.yml`)
      }
    )

    const set_pipeline_step = new ConcourseTs.SetPipelineStep(
      'set-pipeline',
      (step) => {
        step.set_pipeline(pipeline)
        step.set_file(`${resource.name}/${options.path}`)
      }
    )

    const auto_pipeline_job = new ConcourseTs.Job('auto-pipeline', (job) => {
      job.add_steps(get_resource_step)

      if (options.cli_tag) {
        job.add_steps(compile_task.as_task_step(), set_compiled_pipeline_step)
      } else {
        job.add_steps(set_pipeline_step)
      }
    })

    if (customise) {
      customise(pipeline)
    }

    pipeline.add_job(auto_pipeline_job, options.group)
  }
