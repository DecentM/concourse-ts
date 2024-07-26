import * as ConcourseTs from '@decentm/concourse-ts'

export const alpine = {
  apk_add: (...packages: string[]) =>
    new ConcourseTs.Command((command) => {
      command.path = '/sbin/apk'
      command.add_arg('add')
      command.add_arg('--no-cache')
      command.add_arg('--no-progress')

      for (const pkg of packages) {
        command.add_arg(pkg)
      }
    }),
} as const
