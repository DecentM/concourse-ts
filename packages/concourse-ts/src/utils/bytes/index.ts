export type BytesInput = {
  mb?: number
  b?: number
  kb?: number
  gb?: number
}

export const get_bytes = (input: BytesInput): number => {
  let value = 0

  if (input.b) {
    value += input.b
  }

  if (input.kb) {
    value += input.kb * 1000
  }

  if (input.mb) {
    value += input.mb * 100_000
  }

  if (input.gb) {
    value += input.gb * 100_000_000
  }

  return value
}
