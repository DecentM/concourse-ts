import React, {FunctionComponent, useEffect, useState} from 'react'
import {render, Text} from 'ink'
import {getArgv} from '../args'

import {CompileCommand, CompileProps} from './commands/compile'
import {UnknownCommand} from './commands/unknown'

type Props = {
  command: string | number
  options: CompileProps
}

const CliApp: FunctionComponent<Props> = (props) => {
  switch (props.command) {
    case 'compile':
      return <CompileCommand {...props.options} />

    default:
      return <UnknownCommand />
  }
}

export const runApp = async () => {
  const args = await getArgv(process.argv)

  const {cleanup, clear, unmount, waitUntilExit} = render(
    <CliApp command={args._[0]} options={args} />
  )

  try {
    await waitUntilExit()

    unmount()
    clear()
    cleanup()
  } catch (error) {
    clear()
    cleanup()

    process.exit(1)
  }
}
