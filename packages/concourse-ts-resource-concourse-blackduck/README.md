<h1 align="center">
  concourse-ts-resource-concourse-blackduck
</h1>

<div align="center">

  Typed ConcourseBlackduck resource for concourse-ts
</div>

## Installation

`npm i --save-dev @decentm/concourse-ts @decentm/concourse-ts-resource-concourse-blackduck`

`yarn add -D @decentm/concourse-ts @decentm/concourse-ts-resource-concourse-blackduck`

## Usage

The ConcourseBlackduck resource is a typed class that extends the base Resource class.
Therefore, it has the same properties. See the Resource documentation for details.

```typescript
import {Type} from '@decentm/concourse-ts'
import {ConcourseBlackduckResource, ConcourseBlackduckResourceType} from '@decentm/concourse-ts-resource-concourse-blackduck'

export class CorpityCorpConcourseBlackduck extends ConcourseBlackduckResource {
  constructor(name: string, init?: Type.Initer<CorpityCorpConcourseBlackduck>) {
    super(name, new ConcourseBlackduckResourceType(/*...*/))

    // Set defaults here

    if (init) {
      init(this)
    }
  }
}
```
