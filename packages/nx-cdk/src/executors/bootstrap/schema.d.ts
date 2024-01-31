export interface BootstrapExecutorSchema {
  /**
   * profile aws://ACCOUNT-NUMBER-1/REGION-1
   */
  profile?: string;
  /**
   * qualifier
   */
  qualifier?: string;
  /**
   * bootstrap-bucket-name
   */
  bucketName?: string;
  /**
   * cloudformation-execution-policies
   */
  executionPolicy?: string;
  /**
   * tags (cloudformation)
   */
  tag?: string | string[];
  /**
   * trust
   */
  trust?: boolean;
  /**
   * termination-protection
   */
  terminationProtection?: boolean;
  /**
   * bootstrap-kms-key-id
   */
  kmsKeyId?: string;
}
