import {Pipeline} from '../components/pipeline'
import {Task} from '../components/task'
import {Compilation} from './compilation'

export const compile = (input: Pipeline | Task) => {
  const compilation = new Compilation()

  compilation.set_input(input)

  return compilation.compile()
}
