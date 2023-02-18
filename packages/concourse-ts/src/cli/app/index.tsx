import React, {FunctionComponent} from 'react'
import {render} from 'ink'

import {ErrorBoundary} from './components/error-boundary'

import {CompileCommand, CompileProps} from './commands/compile'
import {UnknownCommand} from './commands/unknown'
import {ImportCommand} from './commands/import'

export type AppCommand = 'compile' | 'import'

export type AppProps = {
  command: AppCommand
  options: CompileProps
}

const CliApp: FunctionComponent<AppProps> = (props) => {
  switch (props.command) {
    case 'compile':
      return <CompileCommand {...props.options} />

    case 'import':
      return <ImportCommand {...props.options} />

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
  } catch (error) {
    process.exitCode = 2
  } finally {
    clear()
    cleanup()
  }
}
