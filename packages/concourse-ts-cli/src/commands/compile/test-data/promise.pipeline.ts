import { Command, Job, Pipeline, Task } from '@decentm/concourse-ts'

export default async () => {
  return new Pipeline('a', (pipeline) => {
    pipeline.add_job(
      new Job('aj', (job) => {
        job.add_step(
          new Task('at', (task) => {
            task.platform = 'linux'
            task.set_image_resource({
              type: 'registry-image',
              source: {
                repository: 'alpine',
                tag: 'latest',
              },
            })
            task.run = new Command((command) => {
              command.path = 'echo'
              command.add_args('Hello, world!')
            })
          }).as_task_step()
        )
      })
    )
  })
}
