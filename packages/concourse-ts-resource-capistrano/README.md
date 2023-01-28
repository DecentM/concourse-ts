<h1 align="center">
  concourse-ts-resource-capistrano
</h1>

<div align="center">

  Typed Capistrano resource for concourse-ts
</div>

## Installation

`npm i --save-dev @decentm/concourse-ts @decentm/concourse-ts-resource-capistrano`

`yarn add -D @decentm/concourse-ts @decentm/concourse-ts-resource-capistrano`

## Usage

The Capistrano resource is a typed class that extends the base Resource class.
Therefore, it has the same properties. See the Resource documentation for details.

```typescript
import {Type} from '@decentm/concourse-ts'
import {CapistranoResource, CapistranoResourceType} from '@decentm/concourse-ts-resource-capistrano'

export class CorpityCorpCapistrano extends CapistranoResource {
  constructor(name: string, init?: Type.Initer<CorpityCorpCapistrano>) {
    super(name, new CapistranoResourceType(/*...*/))

    // Set defaults here

    if (init) {
      init(this)
    }
  }
}
```
