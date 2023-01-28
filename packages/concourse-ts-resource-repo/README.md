<h1 align="center">
  concourse-ts-resource-repo
</h1>

<div align="center">

  Typed Repo resource for concourse-ts
</div>

## Installation

`npm i --save-dev @decentm/concourse-ts @decentm/concourse-ts-resource-repo`

`yarn add -D @decentm/concourse-ts @decentm/concourse-ts-resource-repo`

## Usage

The Repo resource is a typed class that extends the base Resource class.
Therefore, it has the same properties. See the Resource documentation for details.

```typescript
import {Type} from '@decentm/concourse-ts'
import {RepoResource, RepoResourceType} from '@decentm/concourse-ts-resource-repo'

export class CorpityCorpRepo extends RepoResource {
  constructor(name: string, init?: Type.Initer<CorpityCorpRepo>) {
    super(name, new RepoResourceType(/*...*/))

    // Set defaults here

    if (init) {
      init(this)
    }
  }
}
```
