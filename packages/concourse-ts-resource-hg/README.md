<h1 align="center">
  concourse-ts-resource-hg
</h1>

<div align="center">

  Typed Hg resource for concourse-ts
</div>

## Installation

`npm i --save-dev @decentm/concourse-ts @decentm/concourse-ts-resource-hg`

`yarn add -D @decentm/concourse-ts @decentm/concourse-ts-resource-hg`

## Usage

The Hg resource is a typed class that extends the base Resource class.
Therefore, it has the same properties. See the Resource documentation for details.

```typescript
import {Type} from '@decentm/concourse-ts'
import {HgResource, HgResourceType} from '@decentm/concourse-ts-resource-hg'

export class CorpityCorpHg extends HgResource {
  constructor(name: string, init?: Type.Initer<CorpityCorpHg>) {
    super(name, new HgResourceType(/*...*/))

    // Set defaults here

    if (init) {
      init(this)
    }
  }
}
```
