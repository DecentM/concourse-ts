import {Command} from '../../components/command'
import {TaskStep} from '../../components/step'
import {Task} from '../../components/task'
import {Initer} from '../../declarations/initialisable'

export class OciBuildTaskStep extends TaskStep {
  constructor(name: string, init?: Initer<OciBuildTaskStep>) {
    super(name, init)

    const task = new Task(`${name}_task`, (task) => {
      task.platform = 'linux'

      task.set_cpu_limit_percent(50)
      task.set_memory_limit_percent(50)

      task.set_image_resource({
        type: 'registry-image',
        source: {
          repository: 'concourse/oci-build-task',
        },
      })

      task.add_output({
        name: 'image',
      })

      task.run = new Command('oci-build', (command) => {
        command.path = 'build'
      })
    })

    this.privileged = true

    this.set_task(task)
  }
}
