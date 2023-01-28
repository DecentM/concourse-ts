<h1 align="center">
  concourse-ts-resource-cf-cli
</h1>

<div align="center">

  Typed CfCli resource for concourse-ts
</div>

## Installation

`npm i --save-dev @decentm/concourse-ts @decentm/concourse-ts-resource-cf-cli`

`yarn add -D @decentm/concourse-ts @decentm/concourse-ts-resource-cf-cli`

## Usage

The CfCli resource is a typed class that extends the base Resource class.
Therefore, it has the same properties. See the Resource documentation for details.

```typescript
import {Type} from '@decentm/concourse-ts'
import {CfCliResource, CfCliResourceType} from '@decentm/concourse-ts-resource-cf-cli'

export class CorpityCorpCfCli extends CfCliResource {
  constructor(name: string, init?: Type.Initer<CorpityCorpCfCli>) {
    super(name, new CfCliResourceType(/*...*/))

    // Set defaults here

    if (init) {
      init(this)
    }
  }
}
```
