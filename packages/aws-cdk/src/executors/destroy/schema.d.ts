export interface DestroyExecutorSchema {
  name: string;
  all?: boolean;
  stack?: string | string[];
  approval?: Approval | boolean;
}
