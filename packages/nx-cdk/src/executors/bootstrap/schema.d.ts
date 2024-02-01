import { CommonExecutorSchema } from '../../common/executor';

export interface BootstrapExecutorSchema extends CommonExecutorSchema {
  profile?: string;
  trust?: boolean;
  kmsKeyId?: string;
  qualifier?: string;
  bucketName?: string;
  executionPolicy?: string;
  terminationProtection?: boolean;
}
