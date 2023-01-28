<h1 align="center">
  concourse-ts-resource-http-jq
</h1>

<div align="center">

  Typed HttpJq resource for concourse-ts
</div>

## Installation

`npm i --save-dev @decentm/concourse-ts @decentm/concourse-ts-resource-http-jq`

`yarn add -D @decentm/concourse-ts @decentm/concourse-ts-resource-http-jq`

## Usage

The HttpJq resource is a typed class that extends the base Resource class.
Therefore, it has the same properties. See the Resource documentation for details.

```typescript
import {Type} from '@decentm/concourse-ts'
import {HttpJqResource, HttpJqResourceType} from '@decentm/concourse-ts-resource-http-jq'

export class CorpityCorpHttpJq extends HttpJqResource {
  constructor(name: string, init?: Type.Initer<CorpityCorpHttpJq>) {
    super(name, new HttpJqResourceType(/*...*/))

    // Set defaults here

    if (init) {
      init(this)
    }
  }
}
```
