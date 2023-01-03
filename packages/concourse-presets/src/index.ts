import * as ConcourseTs from '@decentm/concourse-ts';

export * as ResourceType from './resource-types';
export * as Resource from './resources';
export * as Step from './steps';

export class Pipeline extends ConcourseTs.Pipeline {
  constructor(name: string, init?: ConcourseTs.Initer<Pipeline>) {
    super(name, init);
  }
}

export class Job extends ConcourseTs.Job {
  constructor(name: string, init?: ConcourseTs.Initer<Job>) {
    super(name, init);

    this.build_log_retention = {
      builds: 5,
      minimum_succeeded_builds: 3,
    };
  }
}
