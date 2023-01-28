<h1 align="center">
  concourse-ts-resource-consul-kv
</h1>

<div align="center">

  Typed ConsulKv resource for concourse-ts
</div>

## Installation

`npm i --save-dev @decentm/concourse-ts @decentm/concourse-ts-resource-consul-kv`

`yarn add -D @decentm/concourse-ts @decentm/concourse-ts-resource-consul-kv`

## Usage

The ConsulKv resource is a typed class that extends the base Resource class.
Therefore, it has the same properties. See the Resource documentation for details.

```typescript
import {Type} from '@decentm/concourse-ts'
import {ConsulKvResource, ConsulKvResourceType} from '@decentm/concourse-ts-resource-consul-kv'

export class CorpityCorpConsulKv extends ConsulKvResource {
  constructor(name: string, init?: Type.Initer<CorpityCorpConsulKv>) {
    super(name, new ConsulKvResourceType(/*...*/))

    // Set defaults here

    if (init) {
      init(this)
    }
  }
}
```
