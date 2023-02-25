import fs from 'fs'

const tsconfig = JSON.parse(
  fs.readFileSync('./tsconfig.base.json').toString('utf-8')
)

const newTsconfig = { ...tsconfig }

const packages = fs.readdirSync('packages')
const newPaths: Record<string, string[]> = {}

packages.forEach((pkg) => {
  newPaths[`@decentm/${pkg}`] = [`packages/${pkg}/src/index.ts`]
})

newTsconfig.compilerOptions.paths = newPaths

fs.writeFileSync('./tsconfig.base.json', JSON.stringify(newTsconfig, null, 2))

console.log('tsconfig.base.json paths regenerated')
