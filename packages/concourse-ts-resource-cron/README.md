<h1 align="center">
  concourse-ts-resource-cron
</h1>

<div align="center">

  Typed Cron resource for concourse-ts
</div>

## Installation

`npm i --save-dev @decentm/concourse-ts @decentm/concourse-ts-resource-cron`

`yarn add -D @decentm/concourse-ts @decentm/concourse-ts-resource-cron`

## Usage

The Cron resource is a typed class that extends the base Resource class.
Therefore, it has the same properties. See the Resource documentation for details.

```typescript
import {Type} from '@decentm/concourse-ts'
import {CronResource, CronResourceType} from '@decentm/concourse-ts-resource-cron'

export class CorpityCorpCron extends CronResource {
  constructor(name: string, init?: Type.Initer<CorpityCorpCron>) {
    super(name, new CronResourceType(/*...*/))

    // Set defaults here

    if (init) {
      init(this)
    }
  }
}
```
