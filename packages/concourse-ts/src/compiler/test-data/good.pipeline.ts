import { Command, Job, Pipeline, Task } from '../../components/index.js'

export default () => {
  return new Pipeline('a', (pipeline) => {
    pipeline.add_job(
      new Job('aj', (job) => {
        job.add_steps(
          new Task('at', (task) => {
            task.set_platform('linux')
            task.set_image_resource({
              type: 'registry-image',
              source: {
                repository: 'alpine',
                tag: 'latest',
              },
            })
            task.set_run(new Command((command) => {
              command.set_path('echo')
              command.add_args('Hello, world!')
            }))
          }).as_task_step()
        )
      })
    )
  })
}
