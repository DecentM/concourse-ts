import TypedEmitter, {EventMap} from 'typed-emitter'
import EventEmitter from 'events'

export abstract class CliCommand<
  Params,
  Events extends EventMap
> extends (EventEmitter as {
  new <T extends EventMap>(): TypedEmitter<T>
})<Events> {
  constructor(protected params: Params) {
    super()
  }

  public abstract run(): Promise<void>
}
