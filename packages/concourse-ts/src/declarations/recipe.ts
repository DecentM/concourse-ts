import {Customiser} from './customiser'

export type Recipe<Options, Type, Context = Type> = (
  options: Options,
  customise?: Customiser<Context>
) => Customiser<Type>
