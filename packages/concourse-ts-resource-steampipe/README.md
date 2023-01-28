<h1 align="center">
  concourse-ts-resource-steampipe
</h1>

<div align="center">

  Typed Steampipe resource for concourse-ts
</div>

## Installation

`npm i --save-dev @decentm/concourse-ts @decentm/concourse-ts-resource-steampipe`

`yarn add -D @decentm/concourse-ts @decentm/concourse-ts-resource-steampipe`

## Usage

The Steampipe resource is a typed class that extends the base Resource class.
Therefore, it has the same properties. See the Resource documentation for details.

```typescript
import {Type} from '@decentm/concourse-ts'
import {SteampipeResource, SteampipeResourceType} from '@decentm/concourse-ts-resource-steampipe'

export class CorpityCorpSteampipe extends SteampipeResource {
  constructor(name: string, init?: Type.Initer<CorpityCorpSteampipe>) {
    super(name, new SteampipeResourceType(/*...*/))

    // Set defaults here

    if (init) {
      init(this)
    }
  }
}
```
