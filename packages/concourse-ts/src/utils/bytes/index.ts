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
