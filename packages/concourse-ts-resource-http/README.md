<h1 align="center">
  concourse-ts-resource-http
</h1>

<div align="center">

  Typed Http resource for concourse-ts
</div>

## Installation

`npm i --save-dev @decentm/concourse-ts @decentm/concourse-ts-resource-http`

`yarn add -D @decentm/concourse-ts @decentm/concourse-ts-resource-http`

## Usage

The Http resource is a typed class that extends the base Resource class.
Therefore, it has the same properties. See the Resource documentation for details.

```typescript
import {Type} from '@decentm/concourse-ts'
import {HttpResource, HttpResourceType} from '@decentm/concourse-ts-resource-http'

export class CorpityCorpHttp extends HttpResource {
  constructor(name: string, init?: Type.Initer<CorpityCorpHttp>) {
    super(name, new HttpResourceType(/*...*/))

    // Set defaults here

    if (init) {
      init(this)
    }
  }
}
```
