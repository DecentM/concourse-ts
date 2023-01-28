<h1 align="center">
  concourse-ts-resource-paas-grafana-annotation
</h1>

<div align="center">

  Typed PaasGrafanaAnnotation resource for concourse-ts
</div>

## Installation

`npm i --save-dev @decentm/concourse-ts @decentm/concourse-ts-resource-paas-grafana-annotation`

`yarn add -D @decentm/concourse-ts @decentm/concourse-ts-resource-paas-grafana-annotation`

## Usage

The PaasGrafanaAnnotation resource is a typed class that extends the base Resource class.
Therefore, it has the same properties. See the Resource documentation for details.

```typescript
import {Type} from '@decentm/concourse-ts'
import {PaasGrafanaAnnotationResource, PaasGrafanaAnnotationResourceType} from '@decentm/concourse-ts-resource-paas-grafana-annotation'

export class CorpityCorpPaasGrafanaAnnotation extends PaasGrafanaAnnotationResource {
  constructor(name: string, init?: Type.Initer<CorpityCorpPaasGrafanaAnnotation>) {
    super(name, new PaasGrafanaAnnotationResourceType(/*...*/))

    // Set defaults here

    if (init) {
      init(this)
    }
  }
}
```
