<h1 align="center">
  concourse-ts-resource-concourse-slack-notifier
</h1>

<div align="center">

  Typed ConcourseSlackNotifier resource for concourse-ts
</div>

## Installation

`npm i --save-dev @decentm/concourse-ts @decentm/concourse-ts-resource-concourse-slack-notifier`

`yarn add -D @decentm/concourse-ts @decentm/concourse-ts-resource-concourse-slack-notifier`

## Usage

The ConcourseSlackNotifier resource is a typed class that extends the base Resource class.
Therefore, it has the same properties. See the Resource documentation for details.

```typescript
import {Type} from '@decentm/concourse-ts'
import {ConcourseSlackNotifierResource, ConcourseSlackNotifierResourceType} from '@decentm/concourse-ts-resource-concourse-slack-notifier'

export class CorpityCorpConcourseSlackNotifier extends ConcourseSlackNotifierResource {
  constructor(name: string, init?: Type.Initer<CorpityCorpConcourseSlackNotifier>) {
    super(name, new ConcourseSlackNotifierResourceType(/*...*/))

    // Set defaults here

    if (init) {
      init(this)
    }
  }
}
```
