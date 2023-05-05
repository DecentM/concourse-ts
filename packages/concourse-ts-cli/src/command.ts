import { Command, Option } from 'commander'

export abstract class CliCommand extends Command {
  constructor(name: string) {
    super(name)

    this.addOption(
      new Option('-o, --output <path>', 'path of the file to write into')
    )
      .addOption(new Option('-i, --input <path>', 'path of the file to read from'))
      .addOption(
        new Option(
          '-c, --clean',
          'recursively delete output path before writing results'
        )
      )
  }
}
