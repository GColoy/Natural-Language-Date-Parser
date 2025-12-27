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

export class MultiRegEx<T> implements RegExGroup<T> {
  constructor(
    readonly groups: RegExGroup<T>[],
    readonly defaultValue: T,
    readonly groupName: string,
  ) {}

  getValue(matchGroups: { [key: string]: string; }): T {
    for (let i = 0; i < this.groups.length; i++) {
      const match = matchGroups[this.getGroupName(i)]
      if (!match) continue;
      const group = this.groups[i];
      return group.getValue(matchGroups);
    }
    return this.defaultValue;
  }

  getRegexString(): string {
    const joinedString = this.groups.reduce<string>((acc, curr, index) => {
      return acc + `${acc === "" ? "" : "|"}` + `(?<${this.getGroupName(index)}>` + curr.getRegexString() + ")";
    }, "")
    return `(${joinedString})`;
  }

  getGroupName(index: number) {
    return `${this.groupName}_${index}`;
  }
}