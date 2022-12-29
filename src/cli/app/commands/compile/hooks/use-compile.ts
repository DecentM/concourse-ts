import {useState} from 'react'
import glob from 'fast-glob'
import VError from 'verror'

import {CompileProps} from '..'
import {Pipeline} from '~/components/pipeline'
import {useApp} from 'ink'

const fileValid = (filePath: string) => {
  // Must be a Typescript file
  if (!filePath.endsWith('.ts')) {
    return false
  }

  const file = require(filePath)

  // Must have a default export
  if (!('default' in file)) {
    return false
  }

  // Default export must be a function
  if (typeof file.default !== 'function') {
    return false
  }

  // Default export must return a Pipeline instance
  if (!(file.default() instanceof Pipeline)) {
    return false
  }

  return true
}

export const useCompile = (props: CompileProps) => {
  const [loading, setLoading] = useState(true)
  const [fileList, setFileList] = useState<string[]>([])
  const [error, setError] = useState<VError | null>(null)
  const {exit} = useApp()

  const globs = glob(props.input, {
    cwd: process.cwd(),
  })

  globs
    .then((result) => {
      if (!result || result.length === 0) {
        throw new VError('Your glob input matched no files. Aborting.')
      }

      result.forEach((item) => {
        if (fileValid(item)) {
          return
        }

        throw new VError(
          `${item} failed validation. Make sure your glob only resolves to Typescript files with a default export that returns a Pipeline instance.`
        )
      })

      setFileList(result)
      setTimeout(() => {
        exit()
      }, 0)
    })
    .catch((error) => {
      const verror = new VError(error.message)

      verror.cause = error

      setError(verror)
      setTimeout(() => {
        exit(verror)
      }, 0)
    })
    .finally(() => {
      setLoading(false)
    })

  return {
    loading,
    fileList: fileList.map((file) => {
      return {
        path: file,
      }
    }),
    error,
  }
}
