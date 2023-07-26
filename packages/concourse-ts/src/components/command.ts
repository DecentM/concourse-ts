import {Customiser} from '../declarations/customiser'
import * as Type from '../declarations/types'

/**
 * https://concourse-ci.org/tasks.html#schema.command
 */
export class Command {
  private static customiser: Customiser<Command>

  /**
   * Customises every Command created after calling this function. If called
   * multiple times, only the last call will have an effect.
   *
   * @param {Type.Customiser<Command>} customise
   */
  public static customise = (customise: Customiser<Command>) => {
    Command.customiser = customise
  }

  /**
   * https://concourse-ci.org/tasks.html#schema.command
   *
   * @param {Type.Customiser} customise
   */
  constructor(customise?: Customiser<Command>) {
    if (Command.customiser) {
      Command.customiser(this)
    }

    if (customise) {
      customise(this)
    }
  }

  /**
   * https://concourse-ci.org/tasks.html#schema.command.path
   */
  public path?: Type.FilePath

  private args: string[] = []

  /**
   * Adds an argument to this Command
   *
   * https://concourse-ci.org/tasks.html#schema.command.args
   *
   * @param {string} arg
   */
  public add_arg = (arg: string) => {
    this.args.push(arg)
  }

  /**
   * https://concourse-ci.org/tasks.html#schema.command.dir
   */
  public dir?: Type.DirPath

  /**
   * https://concourse-ci.org/tasks.html#schema.command.user
   */
  public user?: string

  /**
   * Converts this Command to its JSON representation
   *
   * @returns {Type.Command}
   */
  public serialise() {
    const result: Type.Command = {
      path: this.path,
      args: this.args,
      dir: this.dir,
      user: this.user,
    }

    return result
  }
}
