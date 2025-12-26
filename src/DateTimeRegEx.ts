import { RegExGroup } from "./regExGroup";
import { Time } from "./time/timeProperties";

export class DateTimeRegExGroup implements RegExGroup<Date> {
  constructor(
    readonly dateParser: RegExGroup<Date>,
    readonly timeParser: RegExGroup<Time>,
    readonly groupName: string,
  ) { }
  getValue(matchGroups: { [key: string]: string; }): Date {
    const match = matchGroups[this.groupName];
    if (!match) return null;
    const time = this.timeParser.getValue(matchGroups);
    const date = this.dateParser.getValue(matchGroups);

    date.setHours(time.hours, time.minutes, 0, 0);
    return date;
  }
  getRegexString(): string {
    return `(?<${this.groupName}>${this.dateParser.getRegexString()}\\s*(?:(\\s+|^)${this.timeParser.getRegexString()})?)?`;
  }
}

