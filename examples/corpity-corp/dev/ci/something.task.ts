// import {...} from '@corpity-corp/ci'
import {Task} from '../../sre/src'

export default () => {
  return new Task('test', (task) => {
    task.platform = 'linux'
  })
}
