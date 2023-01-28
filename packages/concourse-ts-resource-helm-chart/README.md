<h1 align="center">
  concourse-ts-resource-helm-chart
</h1>

<div align="center">

  Typed HelmChart resource for concourse-ts
</div>

## Installation

`npm i --save-dev @decentm/concourse-ts @decentm/concourse-ts-resource-helm-chart`

`yarn add -D @decentm/concourse-ts @decentm/concourse-ts-resource-helm-chart`

## Usage

The HelmChart resource is a typed class that extends the base Resource class.
Therefore, it has the same properties. See the Resource documentation for details.

```typescript
import {Type} from '@decentm/concourse-ts'
import {HelmChartResource, HelmChartResourceType} from '@decentm/concourse-ts-resource-helm-chart'

export class CorpityCorpHelmChart extends HelmChartResource {
  constructor(name: string, init?: Type.Initer<CorpityCorpHelmChart>) {
    super(name, new HelmChartResourceType(/*...*/))

    // Set defaults here

    if (init) {
      init(this)
    }
  }
}
```
