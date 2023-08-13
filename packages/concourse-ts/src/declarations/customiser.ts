/**
 * A customiser is a function that concourse-ts calls during an object's
 * construction. Customiser functions are provided by the user either by calling
 * a static method called `customise`, or by calling a method called `customise`
 * on the class instance itself.
 *
 * For example, this snippet will set a default name on all DoSteps:
 *
 * ```typescript
 * DoStep.customise((do_step) => {
 *   do_step.name = 'my-step'
 * })
 * ```
 */
export type Customiser<Type, Options = void> = Options extends void
  ? (instance: Type) => void
  : (instance: Type, parent: Options) => void
