/**
 * @internal
 */
export const is_shebang = (line: string) => {
  return line.startsWith('#!')
}

/**
 * @internal
 */
export const parse_shebang = (shebang: string) => {
  if (!is_shebang(shebang)) {
    return {
      path: '',
      args: [],
    }
  }

  const cmdline = shebang.slice(2)
  const [path, ...args] = cmdline.split(' ')

  return {
    path,
    args,
  }
}
