<h1 align="center">
  concourse-ts-resource-semver
</h1>

<div align="center">

  Typed Semver resource for concourse-ts
</div>

## Installation

`npm i --save-dev @decentm/concourse-ts @decentm/concourse-ts-resource-semver`

`yarn add -D @decentm/concourse-ts @decentm/concourse-ts-resource-semver`

## Usage

The Semver resource is a typed class that extends the base Resource class.
Therefore, it has the same properties. See the Resource documentation for details.

```typescript
import {Type} from '@decentm/concourse-ts'
import {SemverResource, SemverResourceType} from '@decentm/concourse-ts-resource-semver'

export class CorpityCorpSemver extends SemverResource {
  constructor(name: string, init?: Type.Initer<CorpityCorpSemver>) {
    super(name, new SemverResourceType(/*...*/))

    // Set defaults here

    if (init) {
      init(this)
    }
  }
}
```
