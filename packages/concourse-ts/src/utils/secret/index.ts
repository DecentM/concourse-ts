export type Secret = string & {__type: 'Secret'}

export const is_secret = (input: string): input is Secret => {
  return input.startsWith('((') && input.endsWith('))') && input.length > 4
}

export const get_secret = (input: string): Secret => {
  if (is_secret(input)) {
    return input
  }

  return `((${input}))` as Secret
}
