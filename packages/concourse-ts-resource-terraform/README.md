<h1 align="center">
  concourse-ts-resource-terraform
</h1>

<div align="center">

  Typed Terraform resource for concourse-ts
</div>

## Installation

`npm i --save-dev @decentm/concourse-ts @decentm/concourse-ts-resource-terraform`

`yarn add -D @decentm/concourse-ts @decentm/concourse-ts-resource-terraform`

## Usage

The Terraform resource is a typed class that extends the base Resource class.
Therefore, it has the same properties. See the Resource documentation for details.

```typescript
import {Type} from '@decentm/concourse-ts'
import {TerraformResource, TerraformResourceType} from '@decentm/concourse-ts-resource-terraform'

export class CorpityCorpTerraform extends TerraformResource {
  constructor(name: string, init?: Type.Initer<CorpityCorpTerraform>) {
    super(name, new TerraformResourceType(/*...*/))

    // Set defaults here

    if (init) {
      init(this)
    }
  }
}
```
