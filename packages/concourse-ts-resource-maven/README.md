<h1 align="center">
  concourse-ts-resource-maven
</h1>

<div align="center">

  Typed Maven resource for concourse-ts
</div>

## Installation

`npm i --save-dev @decentm/concourse-ts @decentm/concourse-ts-resource-maven`

`yarn add -D @decentm/concourse-ts @decentm/concourse-ts-resource-maven`

## Usage

The Maven resource is a typed class that extends the base Resource class.
Therefore, it has the same properties. See the Resource documentation for details.

```typescript
import {Type} from '@decentm/concourse-ts'
import {MavenResource, MavenResourceType} from '@decentm/concourse-ts-resource-maven'

export class CorpityCorpMaven extends MavenResource {
  constructor(name: string, init?: Type.Initer<CorpityCorpMaven>) {
    super(name, new MavenResourceType(/*...*/))

    // Set defaults here

    if (init) {
      init(this)
    }
  }
}
```
