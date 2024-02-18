import { Tree, getWorkspaceLayout } from '@nx/devkit';
import { ProjectType } from './constants';

export function toArray(value: string | string[] | undefined): string[] {
  if (value === undefined) return [];
  return Array.isArray(value) ? value : [value];
}

export function exclude<Data, Key extends keyof Data>(
  data: Data,
  keys: Key[]
): Omit<Data, Key> {
  for (const key of keys) {
    delete data[key];
  }
  return data;
}

export function excludeCopy<Data, Key extends keyof Data>(
  data: Data,
  keys: Key[]
): Omit<Data, Key> {
  return exclude({ ...data }, keys);
}

export function pick<T, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {
  const result: Partial<Pick<T, K>> = {};
  for (const key of keys) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      result[key] = obj[key];
    }
  }
  return result as Pick<T, K>;
}

export function sanitizeObject<T>(obj: T) {
  for (const key in obj) {
    if (obj[key] === undefined) {
      delete obj[key];
    }
  }
  return obj;
}

export function sanitizeObjectCopy<T>(obj: T) {
  return sanitizeObject({ ...obj });
}

export function getProjectDir(tree: Tree, type: ProjectType): string {
  const workspace = getWorkspaceLayout(tree);
  const _type = type === ProjectType.Application ? 'appsDir' : 'libsDir';
  return workspace[_type];
}
