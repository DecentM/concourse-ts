<h1 align="center">
  concourse-ts-resource-slack
</h1>

<div align="center">

  Typed Slack resource type for concourse-ts
</div>


## Installation

`npm i --save-dev @decentm/concourse-ts @decentm/concourse-ts-resource-slack`

`yarn add -D @decentm/concourse-ts @decentm/concourse-ts-resource-slack`

## Usage

The Slack resource is a typed class that extends the base Resource class.
Therefore, it has the same properties. See the Resource documentation for details.

```typescript
import {Type} from '@decentm/concourse-ts'
import {SlackResource, SlackResourceType} from '@decentm/concourse-ts-resource-slack'

export class CorpityCorpSlack extends SlackResource {
  constructor(name: string, init?: Type.Initer<CorpityCorpSlack>) {
    super(name, new SlackResourceType(/*...*/))

    // Set defaults here

    if (init) {
      init(this)
    }
  }
}
```
