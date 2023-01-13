import {Pipeline} from '../components/pipeline'
import {Compilation} from './compilation'

export const compile = (input: Pipeline) => {
  const compilation = new Compilation()

  compilation.set_input(input)

  return compilation.compile()
}
