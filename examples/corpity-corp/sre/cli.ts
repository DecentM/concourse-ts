// import * as Concourse from '@decentm/concourse-ts'
import * as ConcourseCli from '../../../src/cli'

const main = async () => {
  const props = await ConcourseCli.parseProps(process.argv)
  await ConcourseCli.runApp(props)
}

main().catch(console.error)
