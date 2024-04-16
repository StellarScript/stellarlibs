import { TestRunnerType } from '@stellarlibs/utils';

export interface AppGeneratorSchema {
   name: string;
   project: string;
   test?: TestRunnerType;
   tag?: string[] | string;
}
