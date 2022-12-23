export type Initer<Type> = (instance: Type) => void

export interface Initialisable<Type> {
  constructor(initer?: Initer<Type>): void
}
