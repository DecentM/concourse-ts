import {VError} from 'verror'
import {Presets, Type} from '../../../../../src'

export class SlackNotification extends Presets.Resource.SlackNotification {
  constructor(name: string) {
    super(name, {
      url: 'https://hooks.slack.com/services/XXXXX',
    })

    this.set_check_every({hours: 1})
  }

  public readonly abort_string = `Job "${Type.BuildMetadata.BuildJobName}" in pipeline "${Type.BuildMetadata.BuildPipelineName}" - manually aborted!\n${Type.BuildMetadata.AtcExternalUrl}/builds/$BUILD_ID`

  public readonly error_string = `Job "${Type.BuildMetadata.BuildJobName}" in pipeline "${Type.BuildMetadata.BuildPipelineName}" - errored!\n${Type.BuildMetadata.AtcExternalUrl}/builds/$BUILD_ID`

  public readonly failure_string = `Job "${Type.BuildMetadata.BuildJobName}" in pipeline "${Type.BuildMetadata.BuildPipelineName}" - failed!\n${Type.BuildMetadata.AtcExternalUrl}/builds/$BUILD_ID`

  public readonly success_string = `Job "${Type.BuildMetadata.BuildJobName}" in pipeline "${Type.BuildMetadata.BuildPipelineName}" - succeeded!\n${Type.BuildMetadata.AtcExternalUrl}/builds/$BUILD_ID`

  public get_params_for = (
    result: 'success' | 'failure' | 'error' | 'abort'
  ): Presets.Resource.SlackPutParams => {
    let text = ''

    switch (result) {
      case 'abort':
        text = this.abort_string
        break

      case 'error':
        text = this.error_string
        break

      case 'failure':
        text = this.failure_string
        break

      case 'success':
        text = this.success_string
        break

      default:
        throw new VError(
          `Slack resource does not support this result: ${result}`
        )
    }

    return {
      text,
      icon_url: 'https://concourse-ci.org/images/logo-white.svg',
      username: 'Concourse',
    }
  }
}
