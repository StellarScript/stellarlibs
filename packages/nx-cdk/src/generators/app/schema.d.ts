import { TestRunner } from '@stellarlibs/utils';

export interface AppGeneratorSchema {
   name: string;
   directory?: string;
   tags: string | string[];
   test?: TestRunner;
}
