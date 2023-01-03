// https://stackoverflow.com/questions/9781218/how-to-change-node-jss-console-font-color
enum Colour {
  Reset = '\x1b[0m',
  FgBlack = '\x1b[30m',
  FgWhite = '\x1b[37m',
  FgRed = '\x1b[31m',
  FgYellow = '\x1b[33m',
  FgBlue = '\x1b[34m',
  FgCyan = '\x1b[36m',
  BgBlack = '\x1b[40m',
  BgRed = '\x1b[41m',
  BgYellow = '\x1b[43m',
  BgBlue = '\x1b[44m',
  BgGray = '\x1b[100m',
}

// Reset before writing anything to prevent previous terminal output from
// interfering with us.
const Prefix = `${Colour.Reset}[${Colour.FgCyan}${Colour.BgBlack}concourse-ts${Colour.Reset}] `

type TemplateStringInserts = Array<string | number>

const decode_template = (
  message: TemplateStringsArray,
  inserts: TemplateStringInserts
) => {
  let output = ''

  message.forEach((part, index) => {
    output += part

    if (inserts[index]) {
      output += Colour.BgGray + Colour.FgBlack
      output += ` ${inserts[index]} `
      output += Colour.Reset
    }
  })

  return output
}

const create_message = (
  prefix: string,
  colours: Colour[],
  message: TemplateStringsArray,
  inserts: TemplateStringInserts
) => {
  let output = Prefix

  output += colours.join('')
  output += ` ${prefix}: `
  output += Colour.Reset
  output += ' '

  output += decode_template(message, inserts)

  return output
}

const log = (
  message: TemplateStringsArray,
  ...inserts: TemplateStringInserts
) => {
  console.log(
    create_message('INFO', [Colour.BgBlue, Colour.FgBlack], message, inserts)
  )
}

log.warn = (
  message: TemplateStringsArray,
  ...inserts: TemplateStringInserts
) => {
  console.warn(
    create_message('WARN', [Colour.BgYellow, Colour.FgBlack], message, inserts)
  )
}

log.error = (
  message: TemplateStringsArray,
  ...inserts: TemplateStringInserts
) => {
  console.error(
    create_message('ERROR', [Colour.BgRed, Colour.FgWhite], message, inserts)
  )
}

export {log}
