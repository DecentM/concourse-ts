import { CompileParams } from './commands/compile'
import { DecompileParams } from './commands/decompile'
import { TransformParams } from './commands/transform'

type RCOptions = {
  compile?: CompileParams
  decompile?: DecompileParams
  transform?: TransformParams
}

export const rc = (options: RCOptions) => options
