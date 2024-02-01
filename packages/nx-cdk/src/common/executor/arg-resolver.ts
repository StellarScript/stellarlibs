import { toArray } from '@stellarlibs/utils';

/**
 *
 *
 */
export interface CommonStackExecutorSchema {
  all?: boolean;
  tag?: string | string[];
  stack?: string | string[];
  parameter?: string | string[];
}

export interface NormalizedCommonStackExecutorSchema {
  exclude: (keyof CommonStackExecutorSchema)[];
  args: {
    _: string[];
    all?: boolean;
    parameters?: string[];
    tags?: string[];
  };
}

export function commonStackExecutorSchema<T extends CommonStackExecutorSchema>(
  schema: T
): NormalizedCommonStackExecutorSchema {
  return {
    exclude: ['stack', 'parameter', 'all', 'tag'],
    args: {
      all: schema.all,
      _: toArray(schema.stack),
      tags: toArray(schema.tag),
      parameters: toArray(schema.parameter),
    },
  };
}

/**
 *
 *
 */
export interface CommonExecutorSchema {
  tag?: string | string[];
  showTemplate?: boolean;
  noPreviousParameters?: boolean;
}

export interface NormalizedCommonExecutorSchema {
  exclude: (keyof CommonExecutorSchema)[];
  args: {
    tags: string[];
    'show-template': boolean;
    'no-previous-parameters': boolean;
  };
}

export function commonExecutorSchema<T extends CommonExecutorSchema>(
  schema: T
): NormalizedCommonExecutorSchema {
  return {
    exclude: ['showTemplate', 'tag', 'noPreviousParameters'],
    args: {
      tags: toArray(schema.tag),
      'show-template': schema.showTemplate,
      'no-previous-parameters': schema.noPreviousParameters,
    },
  };
}
