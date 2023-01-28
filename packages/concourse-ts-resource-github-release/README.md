<h1 align="center">
  concourse-ts-resource-github-release
</h1>

<div align="center">

  Typed GithubRelease resource for concourse-ts
</div>

## Installation

`npm i --save-dev @decentm/concourse-ts @decentm/concourse-ts-resource-github-release`

`yarn add -D @decentm/concourse-ts @decentm/concourse-ts-resource-github-release`

## Usage

The GithubRelease resource is a typed class that extends the base Resource class.
Therefore, it has the same properties. See the Resource documentation for details.

```typescript
import {Type} from '@decentm/concourse-ts'
import {GithubReleaseResource, GithubReleaseResourceType} from '@decentm/concourse-ts-resource-github-release'

export class CorpityCorpGithubRelease extends GithubReleaseResource {
  constructor(name: string, init?: Type.Initer<CorpityCorpGithubRelease>) {
    super(name, new GithubReleaseResourceType(/*...*/))

    // Set defaults here

    if (init) {
      init(this)
    }
  }
}
```
