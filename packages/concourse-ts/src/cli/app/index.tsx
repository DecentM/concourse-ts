import * as React from 'react'
import {render} from 'ink'

import {ErrorBoundary} from './components/error-boundary'

import {CompileCommand, CompileProps} from './commands/compile'
import {UnknownCommand} from './commands/unknown'
import {ImportCommand, ImportProps} from './commands/import'

export type AppCommand = 'compile' | 'import'

type AppPropsCompile = {
  command: 'compile'
  options: CompileProps
}

type AppPropsImport = {
  command: 'import'
  options: ImportProps
}

export type AppProps = AppPropsCompile | AppPropsImport

const CliApp: React.FunctionComponent<AppProps> = (props) => {
  if (props.command === 'compile') {
    return <CompileCommand {...props.options} />
  }

  if (props.command === 'import') {
    return <ImportCommand {...props.options} />
  }

  return <UnknownCommand />
}

export const run_app = async (props: AppProps) => {
  const {cleanup, clear, waitUntilExit} = render(
    <ErrorBoundary>
      <CliApp {...props} />
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
