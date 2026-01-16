import { Customiser } from '../declarations/customiser.js'
import * as Type from '../declarations/types.js'

/**
 * https://concourse-ci.org/docs/tasks/#command-schema
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
   * https://concourse-ci.org/docs/tasks/#command-schema
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

  private path?: Type.FilePath

  /**
   * https://concourse-ci.org/docs/tasks/#command-schema
   */
  public set_path = (path: Type.FilePath) => {
    this.path = path
  }

  private args: string[] = []

  /**
   * Adds arguments to this Command
   *
   * https://concourse-ci.org/docs/tasks/#command-schema
   *
   * @param {string[]} args
   */
  public add_args = (...arg: string[]) => {
    this.args.push(...arg)
  }

  /**
   * Adds arguments before the existing arguments to this Command.
   *
   * https://concourse-ci.org/docs/tasks/#command-schema
   *
   * @param {string[]} args
   */
  public add_args_before = (...arg: string[]) => {
    this.args.unshift(...arg)
  }

  private dir?: Type.DirPath

  /**
   * https://concourse-ci.org/docs/tasks/#command-schema
   */
  public set_dir = (dir: Type.DirPath) => {
    this.dir = dir
  }

  private user?: string

  /**
   * https://concourse-ci.org/docs/tasks/#command-schema
   */
  public set_user = (user: string) => {
    this.user = user
  }

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
