import * as ConcourseTs from '../../../../src/index'

export class Pipeline extends ConcourseTs.Pipeline {
  constructor(name: string, init?: ConcourseTs.Initer<Pipeline>) {
    super(name, init)

    this.set_background_image_url('https://picsum.photos/1920/1080.jpg')
  }
}

export * as ResourceType from './resource-types'
export * as Resource from './resources'
