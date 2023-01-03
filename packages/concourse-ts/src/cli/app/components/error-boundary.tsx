import React, {PropsWithChildren, ReactNode} from 'react'
import {Box, Text} from 'ink'
import useStdoutDimensions from 'ink-use-stdout-dimensions'

import Catch from './functional-error-boundary'

type ErrorBoundaryProps = PropsWithChildren<{
  error?: Error
}>

// Hurr Durr React can't use class components for hooks, and it can't use
// functional components for error boundaries, so we make two components here.
export const ErrorBoundary = Catch((props: ErrorBoundaryProps) => {
  const [columns] = useStdoutDimensions()

  if (props.error) {
    return (
      <Box width={columns}>
        <Text color='red'>Error: {props.error.message}</Text>
      </Box>
    )
  }

  return <>{props.children}</>
})
