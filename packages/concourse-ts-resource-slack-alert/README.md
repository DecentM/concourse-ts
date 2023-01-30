<h1 align="center">
  concourse-ts-resource-slack-alert
</h1>

<div align="center">

  Typed SlackAlert resource type for concourse-ts
</div>


## Installation

`npm i --save-dev @decentm/concourse-ts @decentm/concourse-ts-resource-slack-alert`

`yarn add -D @decentm/concourse-ts @decentm/concourse-ts-resource-slack-alert`

## Usage

The SlackAlert resource is a typed class that extends the base Resource class.
Therefore, it has the same properties. See the Resource documentation for details.

```typescript
import {Type} from '@decentm/concourse-ts'
import {SlackAlertResource, SlackAlertResourceType} from '@decentm/concourse-ts-resource-slack-alert'

export class CorpityCorpSlackAlert extends SlackAlertResource {
  constructor(name: string, init?: Type.Initer<CorpityCorpSlackAlert>) {
    super(name, new SlackAlertResourceType(/*...*/))

    // Set defaults here

    if (init) {
      init(this)
    }
  }
}
```
