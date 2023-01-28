<h1 align="center">
  concourse-ts-resource-openssl-source-code
</h1>

<div align="center">

  Typed OpensslSourceCode resource for concourse-ts
</div>

## Installation

`npm i --save-dev @decentm/concourse-ts @decentm/concourse-ts-resource-openssl-source-code`

`yarn add -D @decentm/concourse-ts @decentm/concourse-ts-resource-openssl-source-code`

## Usage

The OpensslSourceCode resource is a typed class that extends the base Resource class.
Therefore, it has the same properties. See the Resource documentation for details.

```typescript
import {Type} from '@decentm/concourse-ts'
import {OpensslSourceCodeResource, OpensslSourceCodeResourceType} from '@decentm/concourse-ts-resource-openssl-source-code'

export class CorpityCorpOpensslSourceCode extends OpensslSourceCodeResource {
  constructor(name: string, init?: Type.Initer<CorpityCorpOpensslSourceCode>) {
    super(name, new OpensslSourceCodeResourceType(/*...*/))

    // Set defaults here

    if (init) {
      init(this)
    }
  }
}
```
