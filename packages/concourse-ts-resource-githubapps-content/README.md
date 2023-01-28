<h1 align="center">
  concourse-ts-resource-githubapps-content
</h1>

<div align="center">

  Typed GithubappsContent resource for concourse-ts
</div>

## Installation

`npm i --save-dev @decentm/concourse-ts @decentm/concourse-ts-resource-githubapps-content`

`yarn add -D @decentm/concourse-ts @decentm/concourse-ts-resource-githubapps-content`

## Usage

The GithubappsContent resource is a typed class that extends the base Resource class.
Therefore, it has the same properties. See the Resource documentation for details.

```typescript
import {Type} from '@decentm/concourse-ts'
import {GithubappsContentResource, GithubappsContentResourceType} from '@decentm/concourse-ts-resource-githubapps-content'

export class CorpityCorpGithubappsContent extends GithubappsContentResource {
  constructor(name: string, init?: Type.Initer<CorpityCorpGithubappsContent>) {
    super(name, new GithubappsContentResourceType(/*...*/))

    // Set defaults here

    if (init) {
      init(this)
    }
  }
}
```
