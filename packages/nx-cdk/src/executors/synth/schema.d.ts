export interface SynthExecutorSchema {
  app?: string;
  stack?: string | string[];
  all?: boolean;
  quiet?: boolean;
  exclusively?: boolean;
  parameter?: string[];
  tag?: string | string[];
}
