<h1 align="center">
  concourse-ts-resource-webhook-notification
</h1>

<div align="center">

  Typed WebhookNotification resource for concourse-ts
</div>

## Installation

`npm i --save-dev @decentm/concourse-ts @decentm/concourse-ts-resource-webhook-notification`

`yarn add -D @decentm/concourse-ts @decentm/concourse-ts-resource-webhook-notification`

## Usage

The WebhookNotification resource is a typed class that extends the base Resource class.
Therefore, it has the same properties. See the Resource documentation for details.

```typescript
import {Type} from '@decentm/concourse-ts'
import {WebhookNotificationResource, WebhookNotificationResourceType} from '@decentm/concourse-ts-resource-webhook-notification'

export class CorpityCorpWebhookNotification extends WebhookNotificationResource {
  constructor(name: string, init?: Type.Initer<CorpityCorpWebhookNotification>) {
    super(name, new WebhookNotificationResourceType(/*...*/))

    // Set defaults here

    if (init) {
      init(this)
    }
  }
}
```
