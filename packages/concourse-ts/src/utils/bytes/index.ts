export type BytesInput = {
  mb?: number
  b?: number
  kb?: number
  gb?: number
}

const kb = 1_000
const mb = kb * 1000
const gb = mb * 1000

export const get_bytes = (input: BytesInput): number => {
  let value = 0

  if (input.b) {
    value += input.b
  }

  if (input.kb) {
    value += input.kb * kb
  }

  if (input.mb) {
    value += input.mb * mb
  }

  if (input.gb) {
    value += input.gb * gb
  }

  return value
}

export const parse_bytes = (input: number): BytesInput => {
  const result = {
    gb: 0,
    mb: 0,
    kb: 0,
    b: 0,
  }

  let current = input

  while (current > 0) {
    if (current >= gb) {
      current -= gb
      result.gb += 1
      continue
    }

    if (current >= mb) {
      current -= mb
      result.mb += 1
      continue
    }

    if (current >= kb) {
      current -= kb
      result.kb += 1
      continue
    }

    if (current > 0) {
      current -= 1
      result.b += 1
      continue
    }
  }

  // Remove zeroes
  if (result.gb <= 0) {
    Reflect.deleteProperty(result, 'gb')
  }

  if (result.mb <= 0) {
    Reflect.deleteProperty(result, 'mb')
  }

  if (result.kb <= 0) {
    Reflect.deleteProperty(result, 'kb')
  }

  if (result.b <= 0) {
    Reflect.deleteProperty(result, 'b')
  }

  return result
}
