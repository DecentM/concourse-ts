import * as ConcourseCli from '../../../../src/cli'

const main = async () => {
  const props = await ConcourseCli.parseProps(process.argv)

  // ignore the -o parameter and always output to <pwd>/.ci
  props.options.output_directory = '.ci'

  await ConcourseCli.runApp(props)
}

main().catch(console.error)
