<h1 align="center">
  concourse-ts-resource-keyval
</h1>

<div align="center">

  Typed Keyval resource for concourse-ts
</div>

## Installation

`npm i --save-dev @decentm/concourse-ts @decentm/concourse-ts-resource-keyval`

`yarn add -D @decentm/concourse-ts @decentm/concourse-ts-resource-keyval`

## Usage

The Keyval resource is a typed class that extends the base Resource class.
Therefore, it has the same properties. See the Resource documentation for details.

```typescript
import {Type} from '@decentm/concourse-ts'
import {KeyvalResource, KeyvalResourceType} from '@decentm/concourse-ts-resource-keyval'

export class CorpityCorpKeyval extends KeyvalResource {
  constructor(name: string, init?: Type.Initer<CorpityCorpKeyval>) {
    super(name, new KeyvalResourceType(/*...*/))

    // Set defaults here

    if (init) {
      init(this)
    }
  }
}
```
