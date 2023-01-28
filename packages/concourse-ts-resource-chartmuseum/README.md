<h1 align="center">
  concourse-ts-resource-chartmuseum
</h1>

<div align="center">

  Typed Chartmuseum resource for concourse-ts
</div>

## Installation

`npm i --save-dev @decentm/concourse-ts @decentm/concourse-ts-resource-chartmuseum`

`yarn add -D @decentm/concourse-ts @decentm/concourse-ts-resource-chartmuseum`

## Usage

The Chartmuseum resource is a typed class that extends the base Resource class.
Therefore, it has the same properties. See the Resource documentation for details.

```typescript
import {Type} from '@decentm/concourse-ts'
import {ChartmuseumResource, ChartmuseumResourceType} from '@decentm/concourse-ts-resource-chartmuseum'

export class CorpityCorpChartmuseum extends ChartmuseumResource {
  constructor(name: string, init?: Type.Initer<CorpityCorpChartmuseum>) {
    super(name, new ChartmuseumResourceType(/*...*/))

    // Set defaults here

    if (init) {
      init(this)
    }
  }
}
```
