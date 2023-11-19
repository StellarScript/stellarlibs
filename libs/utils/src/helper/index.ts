import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';

type Key<T> = keyof T | string;
type Value = string | number | boolean | undefined;

/**
 * @description A map of arguments
 */
export class ArgumentMap<T> extends Map<Key<T>, Value> {
  public register(key: Key<T>, value: Value): void {
    if (!key || !value) {
      return;
    }
    this.set(key, value);
  }

  public toJson(): T {
    return Object.fromEntries(this) as T;
  }
}

/**
 * @description A set of commands & arguments
 */
export class Commands extends Set {
  public set(command: string) {
    this.add(command);
  }

  get command(): string {
    const command = Array.from(this).join(' ');
    this.clear();
    return command;
  }
}

/**
 *
 * @param args
 * @description Creates a string of arguments
 * @returns
 */
export function createArguments(args: object): string {
  const commands: string[] = [];

  const registerArgs = (key: string, value: string) => {
    if (!value) {
      return;
    }
    if (key === '_') {
      commands.unshift(`${value}`);
    } else {
      commands.push(`--${key} ${value}`);
    }
  };
  for (const arg in args) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const parsedArg = args[arg];
    if (Array.isArray(parsedArg)) {
      parsedArg.forEach((value) => {
        registerArgs(arg, value);
      });
    } else {
      registerArgs(arg, parsedArg);
    }
  }
  return commands.join(' ');
}

export function toArray(value: string | string[] | undefined): string[] {
  if (value === undefined) return [];
  return Array.isArray(value) ? value : [value];
}

export async function classInstance<T extends object>(
  objClass: { new (): T },
  obj: object
) {
  const instance = plainToInstance(objClass, obj);
  const [validation] = await validate(instance, {
    skipMissingProperties: false,
    skipUndefinedProperties: true,
  });
  for (const error in validation?.constraints) {
    throw new Error(validation.constraints[error]);
  }
  return instance;
}
