import { toArray } from '@stellarlibs/utils';

/**
 *
 *
 */
export interface CommonStackExecutorSchema {
  all?: boolean;
  stack?: string | string[];
  parameter?: string | string[];
}

export interface NormalizedCommonStackExecutorSchema {
  exclude: (keyof CommonStackExecutorSchema)[];
  args: {
    _: string[];
    all?: boolean;
    parameters: string[];
  };
}

export function commonStackExecutorSchema<T extends CommonStackExecutorSchema>(
  schema: T
): NormalizedCommonStackExecutorSchema {
  return {
    exclude: ['stack', 'parameter', 'all'],
    args: {
      _: toArray(schema.stack),
      all: schema.all,
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
    exclude: ['showTemplate', 'tag'],
    args: {
      tags: toArray(schema.tag),
      'show-template': schema.showTemplate,
      'no-previous-parameters': schema.noPreviousParameters,
    },
  };
}
