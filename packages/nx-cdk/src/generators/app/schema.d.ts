import { TestRunner } from '@stellar-libs/utils';

export interface AppGeneratorSchema {
  name: string;
  directory?: string;
  tags: string | string[];
  testRunner?: TestRunner;
}
