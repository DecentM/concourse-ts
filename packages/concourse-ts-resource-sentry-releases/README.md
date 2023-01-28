<h1 align="center">
  concourse-ts-resource-sentry-releases
</h1>

<div align="center">

  Typed SentryReleases resource for concourse-ts
</div>

## Installation

`npm i --save-dev @decentm/concourse-ts @decentm/concourse-ts-resource-sentry-releases`

`yarn add -D @decentm/concourse-ts @decentm/concourse-ts-resource-sentry-releases`

## Usage

The SentryReleases resource is a typed class that extends the base Resource class.
Therefore, it has the same properties. See the Resource documentation for details.

```typescript
import {Type} from '@decentm/concourse-ts'
import {SentryReleasesResource, SentryReleasesResourceType} from '@decentm/concourse-ts-resource-sentry-releases'

export class CorpityCorpSentryReleases extends SentryReleasesResource {
  constructor(name: string, init?: Type.Initer<CorpityCorpSentryReleases>) {
    super(name, new SentryReleasesResourceType(/*...*/))

    // Set defaults here

    if (init) {
      init(this)
    }
  }
}
```
