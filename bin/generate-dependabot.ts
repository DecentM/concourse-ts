import fs from 'fs'
import * as YAML from 'yaml'
import path from 'path'

const create_update = (directory: string) => ({
  'package-ecosystem': 'npm',
  'directory': directory,
  'schedule': {
    interval: 'daily',
  },
})

const packages = fs
  .readdirSync('packages')
  .map((pkg) =>
    fs.existsSync(path.join('packages', pkg, 'package.json'))
      ? create_update(`/packages/${pkg}/`)
      : null
  )
  .filter(Boolean)

const dependabot = {
  version: 2,
  updates: [create_update('/'), ...packages],
}

fs.writeFileSync('.github/dependabot.yml', YAML.stringify(dependabot))

console.log('Dependabot config updated:', packages.length, 'packages')
