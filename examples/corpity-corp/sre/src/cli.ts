import * as ConcourseCli from '@decentm/concourse-ts/src/cli'

const main = async () => {
  const props = await ConcourseCli.parseProps(process.argv)

  // ignore the -o parameter and always output to <pwd>/.ci
  props.options.outputDirectory = '.ci'

  await ConcourseCli.runApp(props)
}

main().catch(console.error)
