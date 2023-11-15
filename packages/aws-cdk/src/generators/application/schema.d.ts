export interface ApplicationGeneratorSchema {
  name: string;
  jest?: boolean;
  linting?: boolean;
  directory?: string;
  tag?: string | string[];
}
