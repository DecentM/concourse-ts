<h1 align="center">
  concourse-ts-resource-phraseapp
</h1>

<div align="center">

  Typed Phraseapp resource for concourse-ts
</div>

## Installation

`npm i --save-dev @decentm/concourse-ts @decentm/concourse-ts-resource-phraseapp`

`yarn add -D @decentm/concourse-ts @decentm/concourse-ts-resource-phraseapp`

## Usage

The Phraseapp resource is a typed class that extends the base Resource class.
Therefore, it has the same properties. See the Resource documentation for details.

```typescript
import {Type} from '@decentm/concourse-ts'
import {PhraseappResource, PhraseappResourceType} from '@decentm/concourse-ts-resource-phraseapp'

export class CorpityCorpPhraseapp extends PhraseappResource {
  constructor(name: string, init?: Type.Initer<CorpityCorpPhraseapp>) {
    super(name, new PhraseappResourceType(/*...*/))

    // Set defaults here

    if (init) {
      init(this)
    }
  }
}
```
