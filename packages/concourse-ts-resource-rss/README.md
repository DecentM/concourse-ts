<h1 align="center">
  concourse-ts-resource-rss
</h1>

<div align="center">

  Typed Rss resource for concourse-ts
</div>

## Installation

`npm i --save-dev @decentm/concourse-ts @decentm/concourse-ts-resource-rss`

`yarn add -D @decentm/concourse-ts @decentm/concourse-ts-resource-rss`

## Usage

The Rss resource is a typed class that extends the base Resource class.
Therefore, it has the same properties. See the Resource documentation for details.

```typescript
import {Type} from '@decentm/concourse-ts'
import {RssResource, RssResourceType} from '@decentm/concourse-ts-resource-rss'

export class CorpityCorpRss extends RssResource {
  constructor(name: string, init?: Type.Initer<CorpityCorpRss>) {
    super(name, new RssResourceType(/*...*/))

    // Set defaults here

    if (init) {
      init(this)
    }
  }
}
```
