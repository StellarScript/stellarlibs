export interface GeneratorSchema {
  name: string;
  jest?: boolean;
  linting?: boolean;
  directory?: string;
  tag?: string | string[];
}
