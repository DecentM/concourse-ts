<h1 align="center">
  concourse-ts-resource-static
</h1>

<div align="center">

  Typed Static resource for concourse-ts
</div>

## Installation

`npm i --save-dev @decentm/concourse-ts @decentm/concourse-ts-resource-static`

`yarn add -D @decentm/concourse-ts @decentm/concourse-ts-resource-static`

## Usage

The Static resource is a typed class that extends the base Resource class.
Therefore, it has the same properties. See the Resource documentation for details.

```typescript
import {Type} from '@decentm/concourse-ts'
import {StaticResource, StaticResourceType} from '@decentm/concourse-ts-resource-static'

export class CorpityCorpStatic extends StaticResource {
  constructor(name: string, init?: Type.Initer<CorpityCorpStatic>) {
    super(name, new StaticResourceType(/*...*/))

    // Set defaults here

    if (init) {
      init(this)
    }
  }
}
```
