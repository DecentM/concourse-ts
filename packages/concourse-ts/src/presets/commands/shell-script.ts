import path from 'node:path'

import {Command} from '../../components/command'
import {Initer} from '../../declarations/initialisable'
import {import_script} from '../../utils/shell'

export class ShellScript extends Command {
  constructor(baseDir: string, filePath: string, init?: Initer<ShellScript>) {
    const fullPath = path.resolve(baseDir, filePath)
    const info = path.parse(fullPath)

    super(info.name)
    this.dir = baseDir

    const scriptInfo = import_script(fullPath)
    const binPathInfo = path.parse(scriptInfo.path)

    this.path = scriptInfo.path

    scriptInfo.args.forEach((arg) => {
      this.add_arg(arg)
    })

    switch (binPathInfo.name) {
      case 'sh':
      case 'bash':
      case 'zsh':
      case 'ash':
      case 'fish':
      case 'csh':
      case 'tcsh':
      case 'ksh':
        this.add_arg('-c')
        break
    }

    this.add_arg(scriptInfo.script)

    if (init) {
      init(this)
    }
  }
}
