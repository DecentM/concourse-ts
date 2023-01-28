<h1 align="center">
  concourse-ts-resource-appcenter
</h1>

<div align="center">

  Typed Appcenter resource for concourse-ts
</div>

## Installation

`npm i --save-dev @decentm/concourse-ts @decentm/concourse-ts-resource-appcenter`

`yarn add -D @decentm/concourse-ts @decentm/concourse-ts-resource-appcenter`

## Usage

The Appcenter resource is a typed class that extends the base Resource class.
Therefore, it has the same properties. See the Resource documentation for details.

```typescript
import {Type} from '@decentm/concourse-ts'
import {AppcenterResource, AppcenterResourceType} from '@decentm/concourse-ts-resource-appcenter'

export class CorpityCorpAppcenter extends AppcenterResource {
  constructor(name: string, init?: Type.Initer<CorpityCorpAppcenter>) {
    super(name, new AppcenterResourceType(/*...*/))

    // Set defaults here

    if (init) {
      init(this)
    }
  }
}
```
