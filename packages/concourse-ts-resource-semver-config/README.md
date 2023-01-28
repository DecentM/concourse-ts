<h1 align="center">
  concourse-ts-resource-semver-config
</h1>

<div align="center">

  Typed SemverConfig resource for concourse-ts
</div>

## Installation

`npm i --save-dev @decentm/concourse-ts @decentm/concourse-ts-resource-semver-config`

`yarn add -D @decentm/concourse-ts @decentm/concourse-ts-resource-semver-config`

## Usage

The SemverConfig resource is a typed class that extends the base Resource class.
Therefore, it has the same properties. See the Resource documentation for details.

```typescript
import {Type} from '@decentm/concourse-ts'
import {SemverConfigResource, SemverConfigResourceType} from '@decentm/concourse-ts-resource-semver-config'

export class CorpityCorpSemverConfig extends SemverConfigResource {
  constructor(name: string, init?: Type.Initer<CorpityCorpSemverConfig>) {
    super(name, new SemverConfigResourceType(/*...*/))

    // Set defaults here

    if (init) {
      init(this)
    }
  }
}
```
