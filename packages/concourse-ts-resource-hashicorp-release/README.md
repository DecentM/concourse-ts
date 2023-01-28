<h1 align="center">
  concourse-ts-resource-hashicorp-release
</h1>

<div align="center">

  Typed HashicorpRelease resource for concourse-ts
</div>

## Installation

`npm i --save-dev @decentm/concourse-ts @decentm/concourse-ts-resource-hashicorp-release`

`yarn add -D @decentm/concourse-ts @decentm/concourse-ts-resource-hashicorp-release`

## Usage

The HashicorpRelease resource is a typed class that extends the base Resource class.
Therefore, it has the same properties. See the Resource documentation for details.

```typescript
import {Type} from '@decentm/concourse-ts'
import {HashicorpReleaseResource, HashicorpReleaseResourceType} from '@decentm/concourse-ts-resource-hashicorp-release'

export class CorpityCorpHashicorpRelease extends HashicorpReleaseResource {
  constructor(name: string, init?: Type.Initer<CorpityCorpHashicorpRelease>) {
    super(name, new HashicorpReleaseResourceType(/*...*/))

    // Set defaults here

    if (init) {
      init(this)
    }
  }
}
```
