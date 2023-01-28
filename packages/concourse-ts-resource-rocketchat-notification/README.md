<h1 align="center">
  concourse-ts-resource-rocketchat-notification
</h1>

<div align="center">

  Typed RocketchatNotification resource for concourse-ts
</div>

## Installation

`npm i --save-dev @decentm/concourse-ts @decentm/concourse-ts-resource-rocketchat-notification`

`yarn add -D @decentm/concourse-ts @decentm/concourse-ts-resource-rocketchat-notification`

## Usage

The RocketchatNotification resource is a typed class that extends the base Resource class.
Therefore, it has the same properties. See the Resource documentation for details.

```typescript
import {Type} from '@decentm/concourse-ts'
import {RocketchatNotificationResource, RocketchatNotificationResourceType} from '@decentm/concourse-ts-resource-rocketchat-notification'

export class CorpityCorpRocketchatNotification extends RocketchatNotificationResource {
  constructor(name: string, init?: Type.Initer<CorpityCorpRocketchatNotification>) {
    super(name, new RocketchatNotificationResourceType(/*...*/))

    // Set defaults here

    if (init) {
      init(this)
    }
  }
}
```
