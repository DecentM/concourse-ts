export type Customiser<Type, Options = void> = (
  instance: Type,
  parent: Options
) => void
