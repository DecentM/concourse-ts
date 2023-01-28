<h1 align="center">
  concourse-ts-resource-irc-notification
</h1>

<div align="center">

  Typed IrcNotification resource for concourse-ts
</div>

## Installation

`npm i --save-dev @decentm/concourse-ts @decentm/concourse-ts-resource-irc-notification`

`yarn add -D @decentm/concourse-ts @decentm/concourse-ts-resource-irc-notification`

## Usage

The IrcNotification resource is a typed class that extends the base Resource class.
Therefore, it has the same properties. See the Resource documentation for details.

```typescript
import {Type} from '@decentm/concourse-ts'
import {IrcNotificationResource, IrcNotificationResourceType} from '@decentm/concourse-ts-resource-irc-notification'

export class CorpityCorpIrcNotification extends IrcNotificationResource {
  constructor(name: string, init?: Type.Initer<CorpityCorpIrcNotification>) {
    super(name, new IrcNotificationResourceType(/*...*/))

    // Set defaults here

    if (init) {
      init(this)
    }
  }
}
```
