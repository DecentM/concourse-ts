import {Command, Job, Pipeline, Task} from '../../components'

export default () => {
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
            task.run = new Command('asd', (command) => {
              command.path = 'echo'
              command.add_arg('Hello, world!')
            })
          }).as_task_step()
        )
      })
    )
  })
}
