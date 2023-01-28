<h1 align="center">
  concourse-ts-resource-wechat-notification
</h1>

<div align="center">

  Typed WechatNotification resource for concourse-ts
</div>

## Installation

`npm i --save-dev @decentm/concourse-ts @decentm/concourse-ts-resource-wechat-notification`

`yarn add -D @decentm/concourse-ts @decentm/concourse-ts-resource-wechat-notification`

## Usage

The WechatNotification resource is a typed class that extends the base Resource class.
Therefore, it has the same properties. See the Resource documentation for details.

```typescript
import {Type} from '@decentm/concourse-ts'
import {WechatNotificationResource, WechatNotificationResourceType} from '@decentm/concourse-ts-resource-wechat-notification'

export class CorpityCorpWechatNotification extends WechatNotificationResource {
  constructor(name: string, init?: Type.Initer<CorpityCorpWechatNotification>) {
    super(name, new WechatNotificationResourceType(/*...*/))

    // Set defaults here

    if (init) {
      init(this)
    }
  }
}
```
