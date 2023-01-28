<h1 align="center">
  concourse-ts-resource-marathon
</h1>

<div align="center">

  Typed Marathon resource for concourse-ts
</div>

## Installation

`npm i --save-dev @decentm/concourse-ts @decentm/concourse-ts-resource-marathon`

`yarn add -D @decentm/concourse-ts @decentm/concourse-ts-resource-marathon`

## Usage

The Marathon resource is a typed class that extends the base Resource class.
Therefore, it has the same properties. See the Resource documentation for details.

```typescript
import {Type} from '@decentm/concourse-ts'
import {MarathonResource, MarathonResourceType} from '@decentm/concourse-ts-resource-marathon'

export class CorpityCorpMarathon extends MarathonResource {
  constructor(name: string, init?: Type.Initer<CorpityCorpMarathon>) {
    super(name, new MarathonResourceType(/*...*/))

    // Set defaults here

    if (init) {
      init(this)
    }
  }
}
```
