import React, {FunctionComponent} from 'react'
import {render} from 'ink'

import {CompileCommand, CompileProps} from './commands/compile'
import {UnknownCommand} from './commands/unknown'
import {ErrorBoundary} from './components/error-boundary'

export type AppCommand = 'compile'

export type AppProps = {
  command: AppCommand
  options: CompileProps
}

const CliApp: FunctionComponent<AppProps> = (props) => {
  switch (props.command) {
    case 'compile':
      return <CompileCommand {...props.options} />

    default:
      return <UnknownCommand />
  }
}

export const runApp = async (props: AppProps) => {
  const {cleanup, clear, waitUntilExit} = render(
    <ErrorBoundary>
      <CliApp command={props.command} options={props.options} />
    </ErrorBoundary>
  )

  try {
    await waitUntilExit()

    clear()
    cleanup()
  } catch (error) {
    clear()
    cleanup()

    process.exit(2)
  }
}
