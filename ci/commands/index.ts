import * as ConcourseTs from '@decentm/concourse-ts'

export const alpine = {
  apk_add: (...packages: string[]) =>
    new ConcourseTs.Command((command) => {
      command.path = '/sbin/apk'
      command.add_args('add')
      command.add_args('--no-cache')
      command.add_args('--no-progress')

      for (const pkg of packages) {
        command.add_args(pkg)
      }
    }),
} as const
