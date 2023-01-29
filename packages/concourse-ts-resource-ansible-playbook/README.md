<h1 align="center">
  concourse-ts-resource-ansible-playbook
</h1>

<div align="center">

  Typed AnsiblePlaybook resource for concourse-ts
</div>

## Source

This package implements typings for [concourse-ansible-playbook-resource](https://github.com/troykinsella/concourse-ansible-playbook-resource).

## Installation

`npm i --save-dev @decentm/concourse-ts @decentm/concourse-ts-resource-ansible-playbook`

`yarn add -D @decentm/concourse-ts @decentm/concourse-ts-resource-ansible-playbook`

## Usage

The AnsiblePlaybook resource is a typed class that extends the base Resource class.
Therefore, it has the same properties. See the Resource documentation for details.

```typescript
import {Type} from '@decentm/concourse-ts'
import {AnsiblePlaybookResource, AnsiblePlaybookResourceType} from '@decentm/concourse-ts-resource-ansible-playbook'

export class CorpityCorpAnsiblePlaybook extends AnsiblePlaybookResource {
  constructor(name: string, init?: Type.Initer<CorpityCorpAnsiblePlaybook>) {
    super(name, new AnsiblePlaybookResourceType(/*...*/))

    // Set defaults here

    if (init) {
      init(this)
    }
  }
}
```
