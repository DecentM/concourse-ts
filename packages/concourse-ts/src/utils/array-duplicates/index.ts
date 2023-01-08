import {Config} from '../../declarations/types'

type GetKey<Item> = (item: Item) => string

export const deduplicate_by_key = <Item = Config>(
  getKey: GetKey<Item>,
  array: Item[]
): Item[] => {
  if (!Array.isArray(array)) {
    return []
  }

  const seen_keys: string[] = []

  return array.filter((item) => {
    const key = getKey(item)

    if (seen_keys.includes(key)) {
      return false
    }

    seen_keys.push(key)
    return true
  })
}

export const deduplicate_by_identity = <Item = Config>(
  array: Item[]
): Item[] => {
  if (!Array.isArray(array)) {
    return []
  }

  const seen_items: Item[] = []

  return array.filter((item) => {
    if (seen_items.includes(item)) {
      return false
    }

    seen_items.push(item)
    return true
  })
}

export const has_duplicates_by_key = <Item = Config>(
  getKey: GetKey<Item>,
  array: Item[]
) => {
  const seen_keys: string[] = []

  return array.some((item) => {
    const key = getKey(item)

    if (seen_keys.includes(key)) {
      return true
    }

    seen_keys.push(key)
    return false
  })
}

export const has_duplicates_by_identity = <Item = Config>(array: Item[]) => {
  const seen_items: Item[] = []

  return array.some((item) => {
    if (seen_items.includes(item)) {
      return true
    }

    seen_items.push(item)
    return false
  })
}
