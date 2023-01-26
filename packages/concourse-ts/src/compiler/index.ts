import {Pipeline} from '../components/pipeline'
import {Compilation} from './compilation'

export const compile = <Group extends string = string>(
  input: Pipeline<Group>,
  workdir: string
) => {
  const compilation = new Compilation(workdir)

  compilation.set_input(input)

  return compilation.compile()
}
