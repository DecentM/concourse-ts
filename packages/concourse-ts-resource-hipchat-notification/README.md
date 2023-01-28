<h1 align="center">
  concourse-ts-resource-hipchat-notification
</h1>

<div align="center">

  Typed HipchatNotification resource for concourse-ts
</div>

## Installation

`npm i --save-dev @decentm/concourse-ts @decentm/concourse-ts-resource-hipchat-notification`

`yarn add -D @decentm/concourse-ts @decentm/concourse-ts-resource-hipchat-notification`

## Usage

The HipchatNotification resource is a typed class that extends the base Resource class.
Therefore, it has the same properties. See the Resource documentation for details.

```typescript
import {Type} from '@decentm/concourse-ts'
import {HipchatNotificationResource, HipchatNotificationResourceType} from '@decentm/concourse-ts-resource-hipchat-notification'

export class CorpityCorpHipchatNotification extends HipchatNotificationResource {
  constructor(name: string, init?: Type.Initer<CorpityCorpHipchatNotification>) {
    super(name, new HipchatNotificationResourceType(/*...*/))

    // Set defaults here

    if (init) {
      init(this)
    }
  }
}
```
