<h1 align="center">
  concourse-ts-resource-bosh-io-stemcell
</h1>

<div align="center">

  Typed BoshIoStemcell resource for concourse-ts
</div>

## Installation

`npm i --save-dev @decentm/concourse-ts @decentm/concourse-ts-resource-bosh-io-stemcell`

`yarn add -D @decentm/concourse-ts @decentm/concourse-ts-resource-bosh-io-stemcell`

## Usage

The BoshIoStemcell resource is a typed class that extends the base Resource class.
Therefore, it has the same properties. See the Resource documentation for details.

```typescript
import {Type} from '@decentm/concourse-ts'
import {BoshIoStemcellResource, BoshIoStemcellResourceType} from '@decentm/concourse-ts-resource-bosh-io-stemcell'

export class CorpityCorpBoshIoStemcell extends BoshIoStemcellResource {
  constructor(name: string, init?: Type.Initer<CorpityCorpBoshIoStemcell>) {
    super(name, new BoshIoStemcellResourceType(/*...*/))

    // Set defaults here

    if (init) {
      init(this)
    }
  }
}
```
