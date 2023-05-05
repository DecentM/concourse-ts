import { cosmiconfig } from 'cosmiconfig'
import { TypeScriptLoader } from 'cosmiconfig-typescript-loader'

import { CompileParams } from './commands/compile'
import { DecompileParams } from './commands/decompile'
import { TransformParams } from './commands/transform'

type RCOptions = {
  compile?: Partial<CompileParams>
  decompile?: Partial<DecompileParams>
  transform?: Partial<TransformParams>
}

export const rc = (options: RCOptions) => options

const module_name = 'concourse-ts'

const paths: string[] = []
const search_roots = ['.', '.config']

search_roots.forEach((root) => {
  paths.push(
    `${root}/.${module_name}rc`,
    `${root}/.${module_name}rc.json`,
    `${root}/.${module_name}rc.yaml`,
    `${root}/.${module_name}rc.yml`,
    `${root}/.${module_name}rc.js`,
    `${root}/.${module_name}rc.ts`,
    `${root}/.${module_name}rc.cjs`,
    `${root}/${module_name}.config.js`,
    `${root}/${module_name}.config.ts`,
    `${root}/${module_name}.config.cjs`
  )
})

export const get_config = async (): Promise<RCOptions | null> => {
  const explorer = cosmiconfig(module_name, {
    searchPlaces: paths,
    loaders: {
      '.ts': TypeScriptLoader({
        transpileOnly: true,
      }),
    },
  })

  const result = await explorer.search()

  if (!result) {
    return null
  }

  return result.config as RCOptions
}
