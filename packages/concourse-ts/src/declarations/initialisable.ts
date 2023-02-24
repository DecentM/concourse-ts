export type Initer<Type, Options = void> = (
  instance: Type,
  parent: Options
) => void
