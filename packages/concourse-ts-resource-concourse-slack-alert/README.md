<h1 align="center">
  concourse-ts-resource-concourse-slack-alert
</h1>

<div align="center">

  Typed ConcourseSlackAlert resource for concourse-ts
</div>

## Installation

`npm i --save-dev @decentm/concourse-ts @decentm/concourse-ts-resource-concourse-slack-alert`

`yarn add -D @decentm/concourse-ts @decentm/concourse-ts-resource-concourse-slack-alert`

## Usage

The ConcourseSlackAlert resource is a typed class that extends the base Resource class.
Therefore, it has the same properties. See the Resource documentation for details.

```typescript
import {Type} from '@decentm/concourse-ts'
import {ConcourseSlackAlertResource, ConcourseSlackAlertResourceType} from '@decentm/concourse-ts-resource-concourse-slack-alert'

export class CorpityCorpConcourseSlackAlert extends ConcourseSlackAlertResource {
  constructor(name: string, init?: Type.Initer<CorpityCorpConcourseSlackAlert>) {
    super(name, new ConcourseSlackAlertResourceType(/*...*/))

    // Set defaults here

    if (init) {
      init(this)
    }
  }
}
```
