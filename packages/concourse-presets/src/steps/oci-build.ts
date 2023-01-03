import * as ConcourseTs from '@decentm/concourse-ts';
import { TaskStep } from '@decentm/concourse-ts';

export class OciBuildTaskStep extends TaskStep {
  constructor(name: string, init?: ConcourseTs.Initer<OciBuildTaskStep>) {
    super(name, init);

    const task = new ConcourseTs.Task(`${name}_task`, (task) => {
      task.platform = 'linux';

      task.set_cpu_limit_percent(50);
      task.set_memory_limit_percent(50);

      task.set_image_resource({
        type: 'registry-image',
        source: {
          repository: 'concourse/oci-build-task',
        },
      });

      task.add_output({
        name: 'image',
      });

      task.run = {
        path: 'build',
      };
    });

    this.privileged = true;

    this.set_task(task);
  }
}
