type Key<T> = keyof T | string;
type Value = string | number | boolean | undefined;

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
