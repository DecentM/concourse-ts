import fs from 'fs'
import * as YAML from 'yaml'

const packages = fs.readdirSync('packages')

const create_update = (directory: string) => ({
  'package-ecosystem': 'npm',
  'directory': directory,
  'schedule': {
    interval: 'daily',
  },
})

const dependabot = {
  version: 2,
  updates: [
    create_update('/'),
    ...packages.map((pkg) => create_update(`/packages/${pkg}/`)),
  ],
}

fs.writeFileSync('.github/dependabot.yml', YAML.stringify(dependabot))

console.log('Dependabot config updated:', packages.length, 'packages')
