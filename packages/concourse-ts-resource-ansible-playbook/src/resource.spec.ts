import test from 'ava'

import { AnsiblePlaybookResource } from './resource'
import { AnsiblePlaybookResourceType } from './resource-type'

test('stores name', (t) => {
  const rt = new AnsiblePlaybookResourceType('my-ansible-playbook-resource_type')
  const r = new AnsiblePlaybookResource('my-ansible-playbook-resource', rt, {
    // TODO: Fill this out
  })

  t.is(r.name, 'my-ansible-playbook-resource')
})
