import React, {FunctionComponent} from 'react'
import {Box, Text} from 'ink'
import Spinner from 'ink-spinner'
import useStdoutDimensions from 'ink-use-stdout-dimensions'
import Table from 'ink-table'

import {useCompile} from './hooks/use-decompile'

export type CompileProps = {
  output_directory?: string
  extract_tasks?: boolean
  input: string
}

export const ImportCommand: FunctionComponent<CompileProps> = (props) => {
  const {loading, fileList} = useCompile(props)
  const [columns] = useStdoutDimensions()

  if (loading) {
    return (
      <Box width={columns}>
        <Text>Determining files to import</Text>
        <Spinner type='simpleDotsScrolling' />
      </Box>
    )
  }

  return <Table data={fileList} />
}
