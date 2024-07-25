import { Config } from '../../declarations/types.js'

type GetKey<Item> = (item: Item) => string

const check_duplicates_by_key = <Item = Config>(
  get_key: GetKey<Item>,
  item: Item,
  seen_keys: string[]
) => {
  const key = get_key(item)

  if (seen_keys.includes(key)) {
    return false
  }

  seen_keys.push(key)
  return true
}

const check_duplicates_by_identity = <Item = Config>(
  item: Item,
  seen_items: Item[]
) => {
  if (seen_items.includes(item)) {
    return false
  }

  seen_items.push(item)
  return true
}

export const deduplicate_by_key = <Item = Config>(
  get_key: GetKey<Item>,
  array: Item[]
): Item[] => {
  if (!Array.isArray(array)) {
    return []
  }

  const seen_keys: string[] = []

  return array.filter((item) => check_duplicates_by_key(get_key, item, seen_keys))
}

export const deduplicate_by_identity = <Item = Config>(array: Item[]): Item[] => {
  if (!Array.isArray(array)) {
    return []
  }

  const seen_items: Item[] = []

  return array.filter((item) => check_duplicates_by_identity(item, seen_items))
}

export const has_duplicates_by_key = <Item = Config>(
  get_key: GetKey<Item>,
  array: Item[]
) => {
  const seen_keys: string[] = []

  return array.some((item) => !check_duplicates_by_key(get_key, item, seen_keys))
}

export const has_duplicates_by_identity = <Item = Config>(array: Item[]) => {
  const seen_items: Item[] = []

  return array.some((item) => !check_duplicates_by_identity(item, seen_items))
}
