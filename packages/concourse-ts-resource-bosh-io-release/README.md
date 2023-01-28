<h1 align="center">
  concourse-ts-resource-bosh-io-release
</h1>

<div align="center">

  Typed BoshIoRelease resource for concourse-ts
</div>

## Installation

`npm i --save-dev @decentm/concourse-ts @decentm/concourse-ts-resource-bosh-io-release`

`yarn add -D @decentm/concourse-ts @decentm/concourse-ts-resource-bosh-io-release`

## Usage

The BoshIoRelease resource is a typed class that extends the base Resource class.
Therefore, it has the same properties. See the Resource documentation for details.

```typescript
import {Type} from '@decentm/concourse-ts'
import {BoshIoReleaseResource, BoshIoReleaseResourceType} from '@decentm/concourse-ts-resource-bosh-io-release'

export class CorpityCorpBoshIoRelease extends BoshIoReleaseResource {
  constructor(name: string, init?: Type.Initer<CorpityCorpBoshIoRelease>) {
    super(name, new BoshIoReleaseResourceType(/*...*/))

    // Set defaults here

    if (init) {
      init(this)
    }
  }
}
```
