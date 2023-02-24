export type Initer<Type, Options = void> = (
  instance: Type,
  options: Options
) => void
