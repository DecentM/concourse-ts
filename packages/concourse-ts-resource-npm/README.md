<h1 align="center">
  concourse-ts-resource-npm
</h1>

<div align="center">

  Typed Git resource for concourse-ts
</div>

## Installation

`npm i --save-dev @decentm/concourse-ts @decentm/concourse-ts-resource-npm`

`yarn add -D @decentm/concourse-ts @decentm/concourse-ts-resource-npm`

## Usage

The Git resource is a typed class that extends the base Resource class.
Therefore, it has the same properties. See the Resource documentation for details.

```typescript
import {Type} from '@decentm/concourse-ts'
import {GitResource, GitResourceType} from '@decentm/concourse-ts-resource-npm'

export class CorpityCorpGit extends GitResource {
  constructor(name: string, init?: Type.Initer<CorpityCorpGit>) {
    super(name, new GitResourceType(/*...*/))

    // Set defaults here

    if (init) {
      init(this)
    }
  }
}
```
