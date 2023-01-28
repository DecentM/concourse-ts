<h1 align="center">
  concourse-ts-resource-aptly-cli
</h1>

<div align="center">

  Typed AptlyCli resource for concourse-ts
</div>

## Installation

`npm i --save-dev @decentm/concourse-ts @decentm/concourse-ts-resource-aptly-cli`

`yarn add -D @decentm/concourse-ts @decentm/concourse-ts-resource-aptly-cli`

## Usage

The AptlyCli resource is a typed class that extends the base Resource class.
Therefore, it has the same properties. See the Resource documentation for details.

```typescript
import {Type} from '@decentm/concourse-ts'
import {AptlyCliResource, AptlyCliResourceType} from '@decentm/concourse-ts-resource-aptly-cli'

export class CorpityCorpAptlyCli extends AptlyCliResource {
  constructor(name: string, init?: Type.Initer<CorpityCorpAptlyCli>) {
    super(name, new AptlyCliResourceType(/*...*/))

    // Set defaults here

    if (init) {
      init(this)
    }
  }
}
```
