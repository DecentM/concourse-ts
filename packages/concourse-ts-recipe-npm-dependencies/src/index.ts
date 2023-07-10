import * as ConcourseTs from '@decentm/concourse-ts'
import * as Npm from '@decentm/concourse-ts-resource-npm'

import { PackageJson, Split, LastArrayElement } from 'type-fest'

type SimplePackageDefinition<VarNames extends string> = {
  name: VarNames
  scope?: string
}

const parse_package_name = <VarNames extends string>(
  input: string
): SimplePackageDefinition<VarNames> => {
  const parts = input.split('/')

  if (parts.length < 1 || parts.length > 2) {
    return null
  }

  if (parts[0].startsWith('@') && parts[1]) {
    return {
      name: parts[1] as VarNames,
      scope: parts[0].substring(1, parts[0].length),
    }
  }

  if (parts[0] && !parts[1]) {
    return {
      name: parts[0] as VarNames,
    }
  }

  return null
}

/**
 * Gets a list of package names from a package.json type, where the scope is
 * removed from the package name
 */
type DependencyPackageNames<TPackageJson extends PackageJson> = LastArrayElement<
  Split<
    Extract<
      | keyof TPackageJson['dependencies']
      | keyof TPackageJson['devDependencies']
      | keyof TPackageJson['peerDependencies']
      | keyof TPackageJson['optionalDependencies'],
      string
    >,
    '/'
  >
>

export type CreateNpmDependenciesInput = {
  registry?: string
  registry_token?: ConcourseTs.Utils.Var
  resource_type: Npm.ResourceType
}

export const create_npm_dependencies =
  <TPackageJson extends PackageJson>(
    pkg: TPackageJson,
    input: CreateNpmDependenciesInput
  ): ConcourseTs.Type.Recipe<
    ConcourseTs.DoStep | ConcourseTs.InParallelStep,
    Record<DependencyPackageNames<TPackageJson>, ConcourseTs.Utils.Var>
  > =>
  (customise) =>
  (step) => {
    type VarNames = DependencyPackageNames<TPackageJson>

    const packages: SimplePackageDefinition<VarNames>[] = []

    if (pkg.dependencies) {
      packages.push(
        ...Object.keys(pkg.dependencies).map((package_name) =>
          parse_package_name<VarNames>(package_name)
        )
      )
    }

    if (pkg.devDependencies) {
      packages.push(
        ...Object.keys(pkg.devDependencies).map((package_name) =>
          parse_package_name<VarNames>(package_name)
        )
      )
    }

    if (pkg.optionalDependencies) {
      packages.push(
        ...Object.keys(pkg.optionalDependencies).map((package_name) =>
          parse_package_name<VarNames>(package_name)
        )
      )
    }

    if (pkg.peerDependencies) {
      packages.push(
        ...Object.keys(pkg.peerDependencies).map((package_name) =>
          parse_package_name<VarNames>(package_name)
        )
      )
    }

    const var_names: Record<VarNames, ConcourseTs.Utils.Var> = {} as Record<
      VarNames,
      ConcourseTs.Utils.Var
    >

    packages.forEach((pkg) => {
      const npm_package: Npm.Resource = new ConcourseTs.Resource(
        pkg.name,
        input.resource_type,
        (r) => {
          r.icon = 'npm'
          r.source = {
            package: pkg.name,
            scope: pkg.scope,
            registry: {
              uri: input.registry ?? 'https://registry.npmjs.org',
              token: input.registry_token,
            },
          }
        }
      )

      const load_var = new ConcourseTs.LoadVarStep(
        `load-${npm_package.name}`,
        (lvs) => {
          lvs.load_var = `${npm_package.name}-version`
          lvs.file = `${npm_package.name}/version`
        }
      )

      step.add_step(
        new ConcourseTs.DoStep(`load_${pkg.name}`, (ds) => {
          ds.add_step(
            npm_package.as_get_step({
              params: { skip_download: true },
            })
          )
          ds.add_step(load_var)
        })
      )

      var_names[pkg.name] = load_var.var
    })

    if (customise) {
      customise(step, var_names)
    }
  }
