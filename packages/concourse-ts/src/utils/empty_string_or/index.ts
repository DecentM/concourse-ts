import {type_of} from '../type-of'

export const empty_string_or = <T = unknown>(
  predicate: T,
  value_factory: (value: T) => string
) => {
  switch (type_of(predicate)) {
    case 'undefined':
    case 'null':
      return ''

    case 'array':
      return (predicate as Array<unknown>).length
        ? value_factory(predicate)
        : ''

    default:
      return value_factory(predicate)
  }
}
