export const deduplicate_by_key = <T extends Record<string, any>>(
  key: string,
  array: T[]
): T[] => {
  if (!Array.isArray(array)) {
    return []
  }

  const seen_keys: string[] = []

  return array.filter((item) => {
    if (seen_keys.includes(item[key])) {
      return false
    }

    seen_keys.push(item[key])
    return true
  })
}

export const has_duplicates_by_key = <T extends Record<string, any>>(
  key: string,
  array: T[]
) => {
  const seen_keys: string[] = []

  return array.some((item) => {
    if (seen_keys.includes(item[key])) {
      return true
    }

    seen_keys.push(item[key])
    return false
  })
}
