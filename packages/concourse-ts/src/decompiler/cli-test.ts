import {parseProps, runApp} from '../cli'

const main = async () => {
  const props = await parseProps(process.argv)
  await runApp(props)
}

main().catch(console.error)
