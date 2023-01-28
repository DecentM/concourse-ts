<h1 align="center">
  concourse-ts-resource-pulumi
</h1>

<div align="center">

  Typed Pulumi resource for concourse-ts
</div>

## Installation

`npm i --save-dev @decentm/concourse-ts @decentm/concourse-ts-resource-pulumi`

`yarn add -D @decentm/concourse-ts @decentm/concourse-ts-resource-pulumi`

## Usage

The Pulumi resource is a typed class that extends the base Resource class.
Therefore, it has the same properties. See the Resource documentation for details.

```typescript
import {Type} from '@decentm/concourse-ts'
import {PulumiResource, PulumiResourceType} from '@decentm/concourse-ts-resource-pulumi'

export class CorpityCorpPulumi extends PulumiResource {
  constructor(name: string, init?: Type.Initer<CorpityCorpPulumi>) {
    super(name, new PulumiResourceType(/*...*/))

    // Set defaults here

    if (init) {
      init(this)
    }
  }
}
```
