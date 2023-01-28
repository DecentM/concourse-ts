<h1 align="center">
  concourse-ts-resource-bitbucket-build-status-notification
</h1>

<div align="center">

  Typed BitbucketBuildStatusNotification resource for concourse-ts
</div>

## Installation

`npm i --save-dev @decentm/concourse-ts @decentm/concourse-ts-resource-bitbucket-build-status-notification`

`yarn add -D @decentm/concourse-ts @decentm/concourse-ts-resource-bitbucket-build-status-notification`

## Usage

The BitbucketBuildStatusNotification resource is a typed class that extends the base Resource class.
Therefore, it has the same properties. See the Resource documentation for details.

```typescript
import {Type} from '@decentm/concourse-ts'
import {BitbucketBuildStatusNotificationResource, BitbucketBuildStatusNotificationResourceType} from '@decentm/concourse-ts-resource-bitbucket-build-status-notification'

export class CorpityCorpBitbucketBuildStatusNotification extends BitbucketBuildStatusNotificationResource {
  constructor(name: string, init?: Type.Initer<CorpityCorpBitbucketBuildStatusNotification>) {
    super(name, new BitbucketBuildStatusNotificationResourceType(/*...*/))

    // Set defaults here

    if (init) {
      init(this)
    }
  }
}
```
