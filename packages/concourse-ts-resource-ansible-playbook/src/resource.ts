import { Resource, Utils } from '@decentm/concourse-ts'
import { AnsiblePlaybookResourceType } from './resource-type'

/**
 * https://github.com/troykinsella/concourse-ansible-playbook-resource#source-configuration
 */
export type Source = {
  /**
   * Default false. Echo commands and other normally-hidden outputs useful for
   * troubleshooting.
   */
  debug?: boolean
  /**
   * A list of environment variables to apply. Useful for supplying task
   * configuration dependencies like AWS_ACCESS_KEY_ID, for example, or
   * specifying ansible configuration options that are unsupported by this
   * resource. Note: Unsupported ansible configurations can also be applied in
   * ansible.cfg in the playbook source.
   */
  env?: Record<string, string>
  /**
   * A list of git global configurations to apply (with git config --global).
   */
  git_global_config?: Record<string, string>
  /**
   * The username for git http/s access.
   */
  git_https_username?: Utils.Secret | string
  /**
   * The password for git http/s access.
   */
  git_https_password?: Utils.Secret
  /**
   * The git ssh private key.
   */
  git_private_key?: Utils.Secret
  /**
   * Default false. Don't verify TLS certificates.
   */
  git_skip_ssl_verification?: boolean
  /**
   * Connect to the remote system with this user.
   */
  user?: Utils.Secret | string
  /**
   * Default requirements.yml. If this file is present in the playbook source
   * directory, it is used with ansible-galaxy --install before running the
   * playbook.
   */
  requirements?: string
  /**
   * Specify options to pass to ssh.
   */
  ssh_common_args?: string
  /**
   * The ssh private key with which to connect to the remote system.
   */
  ssh_private_key?: Utils.Secret
  /**
   * The value of the ansible-vault password.
   */
  vault_password?: Utils.Secret
  /**
   * Specify, v, vv, etc., to increase the verbosity of the ansible-playbook
   * execution.
   */
  verbose?: 'v' | 'vv' | 'vvv' | 'vvvv' | 'vvvvv'
}

/**
 * https://github.com/troykinsella/concourse-ansible-playbook-resource#source-configuration
 */
export type PutParams = {
  /**
   * The path to the directory containing playbook sources. This typically will
   * point to a resource pulled from source control.
   */
  path: string
  /**
   * Default false. Run operations as become (privilege escalation).
   */
  become?: boolean
  /**
   * Run operations with this user.
   */
  become_user?: Utils.Secret | string
  /**
   * Privilege escalation method to use.
   */
  become_method?: string
  /**
   * Default false. Don't make any changes; instead, try to predict some of the
   * changes that may occur.
   */
  check?: boolean
  /**
   * Default false. When changing (small) files and templates, show the
   * differences in those files; works great with check: true.
   */
  diff?: boolean
  inventory: string
  /**
   * Limit the playbook run to provided hosts/groups.
   */
  limit?: string
  /**
   * Default site.yml. The path to the playbook file to run, relative to path.
   */
  playbook?: string
  /**
   * Only run plays and tasks not tagged with this list of values.
   */
  skip_tags?: boolean
  /**
   * A list of shell commands to run before executing the playbook. See the
   * Custom Setup Commands section for explanation.
   * https://github.com/troykinsella/concourse-ansible-playbook-resource#custom-setup-commands
   */
  setup_commands?: string[]
  /**
   * Only run plays and tasks tagged with this list of values.
   */
  tags?: string[]
  /**
   * An object of extra variables to pass to ansible-playbook. Mutually
   * exclusive with vars_file.
   */
  vars?: Record<string, string>
  /**
   * A file containing a JSON object of extra variables to pass to
   * ansible-playbook. Mutually exclusive with vars.
   */
  vars_file?: string
}

export type GetParams = never

export class AnsiblePlaybookResource extends Resource<Source, PutParams, GetParams> {
  constructor(
    public override name: string,
    type: AnsiblePlaybookResourceType,
    source: Source
  ) {
    super(name, type)

    this.source = source
  }
}
