import React, {FunctionComponent} from 'react'

type ErrorHandler = (error: Error, info: React.ErrorInfo) => void

type ErrorState = {error?: Error}

export default function Catch<Props extends ErrorState>(
  ErrorComponent: FunctionComponent<Props>,
  errorHandler?: ErrorHandler
): React.ComponentType<Props> {
  return class extends React.Component<Props, ErrorState> {
    state: ErrorState = {
      error: undefined,
    }

    static getDerivedStateFromError(error: Error) {
      return {error}
    }

    componentDidCatch(error: Error, info: React.ErrorInfo) {
      process.exitCode = 1

      if (errorHandler) {
        errorHandler(error, info)
      }
    }

    render() {
      return <ErrorComponent {...this.props} error={this.state.error} />
    }
  }
}
