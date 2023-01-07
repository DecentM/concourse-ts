export type Secret = string & {__type: 'Secret'}

export const is_secret = (input: string): input is Secret => {
  return input.startsWith('((') && input.endsWith('))')
}

export const get_secret = (key: string): Secret => {
  return `((${key}))` as Secret
}
