import { CommonExecutorSchema, CommonStackExecutorSchema } from '../../common/executor';

export interface SynthExecutorSchema extends CommonStackExecutorSchema, CommonExecutorSchema {
  app?: string;
  quiet?: boolean;
  exclusively?: boolean;
}
