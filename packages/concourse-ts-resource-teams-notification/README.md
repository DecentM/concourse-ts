<h1 align="center">
  concourse-ts-resource-teams-notification
</h1>

<div align="center">

  Typed TeamsNotification resource for concourse-ts
</div>

## Installation

`npm i --save-dev @decentm/concourse-ts @decentm/concourse-ts-resource-teams-notification`

`yarn add -D @decentm/concourse-ts @decentm/concourse-ts-resource-teams-notification`

## Usage

The TeamsNotification resource is a typed class that extends the base Resource class.
Therefore, it has the same properties. See the Resource documentation for details.

```typescript
import {Type} from '@decentm/concourse-ts'
import {TeamsNotificationResource, TeamsNotificationResourceType} from '@decentm/concourse-ts-resource-teams-notification'

export class CorpityCorpTeamsNotification extends TeamsNotificationResource {
  constructor(name: string, init?: Type.Initer<CorpityCorpTeamsNotification>) {
    super(name, new TeamsNotificationResourceType(/*...*/))

    // Set defaults here

    if (init) {
      init(this)
    }
  }
}
```
