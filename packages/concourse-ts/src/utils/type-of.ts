export type Type =
  | 'null'
  | 'undefined'
  | 'number'
  | 'string'
  | 'boolean'
  | 'array'
  | 'object'
  | 'function'
  | 'symbol'
  | 'unknown'
  | 'bigint'

export const type_of = (input: unknown): Type => {
  if (input === null) {
    return 'null'
  }

  if (Array.isArray(input)) {
    return 'array'
  }

  switch (typeof input) {
    case 'number':
      return 'number'
    case 'symbol':
      return 'symbol'
    case 'boolean':
      return 'boolean'
    case 'function':
      return 'function'
    case 'undefined':
      return 'undefined'
    case 'bigint':
      return 'bigint'
    case 'string':
      return 'string'
  }

  try {
    // Throws if the input is not an object
    Object.getPrototypeOf(input)
    return 'object'
  } catch {
    // skip
  }

  return 'unknown'
}
