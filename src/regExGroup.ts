export type RegExSetting<T> = {default: T, aliases: {[key: string]: T}};

export interface RegExGroup<T> {
  getValue(matchGroups: {[key: string]: string}): T;
  getRegexString(): string;
}

export abstract class RegExGroupBase<T> implements RegExGroup<T> {
  constructor(readonly groupName: string) { }
  abstract getValue(matchGroups: {[key: string]: string}): T; 
  abstract getRegexOptions(): string;
  getRegexString(): string {
    return `(?<${this.groupName}>${this.getRegexOptions()})?`;
  }
}

export abstract class BasicRegExGroup<T> extends RegExGroupBase<T> {
  abstract getDefault(): T;
  abstract getAliases(): {[key: string]: T};
  
  getValue(matchGroups: {[key: string]: string}): T {
    const alias = matchGroups[this.groupName];
    if (!alias) return this.getDefault();
    const pattern = this.getAliases();
    const value = pattern[alias!.toLowerCase()];
    if (value === undefined) return this.getDefault();
    return value;
  }
  getRegexOptions(): string {
    const pattern = this.getAliases()
    const aliases = Object.keys(pattern)
      .sort((a, b) => b.length - a.length);
    let regexString = '';
    regexString += aliases.join('|');
    return regexString;
  }
}

export class SimpleRegExGroup<T> extends BasicRegExGroup<T> {
  constructor(
    readonly getAliases: () => {[key: string]: T},
    readonly getDefault: () => T
  ) {
    super("name");
  }
}

