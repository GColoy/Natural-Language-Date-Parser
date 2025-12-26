import { BasicRegExGroup, RegExGroup, RegExGroupBase } from "./regExGroup";
import { Day, DayDelta, Direction, Multiplier, RelativeDay, Sign, Time } from "./dateProperties";

export type dateAliasSettings<T> = {value: T, aliases: string[]}[];

export type FullDateAliasSettings = {
  direction: dateAliasSettings<Direction>,
  day: dateAliasSettings<Day>,
  relativeDays: dateAliasSettings<RelativeDay>,
  sign: dateAliasSettings<Sign>,
  multiplier: dateAliasSettings<Multiplier>
}

export type DateDefaults = {
  direction: Direction,
  relativeDays: RelativeDay,
  sign: Sign,
  multiplier: Multiplier
}

function invertSettings<T>(aliases: dateAliasSettings<T>): { [key: string]: T; } {
  let aliasesMap: {[key: string]: T} = {};
  for (let setting of aliases) {
    for (let alias of setting.aliases) {
      aliasesMap[alias.toLowerCase()] = setting.value;
    }
  }
  return aliasesMap;
}

export class BasicPropertieRegExGroup<T> extends BasicRegExGroup<T> {
  aliasesMap: {[key: string]: T} = {};
  constructor(
    readonly defaultDirection: T,
    readonly aliases: dateAliasSettings<T>,
    readonly groupName: string
  ) {
    super(groupName);

    this.aliasesMap = invertSettings(aliases);
  }
  
  getDefault(): T{
    return this.defaultDirection;
  }
  getAliases(): { [key: string]: T; } {
    return this.aliasesMap;
  }
}

export class DayRegExGroup extends BasicRegExGroup<Day> {
  readonly refrenceDate: Date;
  readonly relativeDaysSettings: {[key: string]: RelativeDay};
  readonly daySettings: {[key: string]: Day};
  constructor(refrenceDate: Date, groupName: string, relativeDaysSettings: dateAliasSettings<RelativeDay>, daySettings: dateAliasSettings<Day>) {
    super(groupName);
    this.refrenceDate = new Date(refrenceDate);
    this.relativeDaysSettings = invertSettings(relativeDaysSettings);
    this.daySettings = invertSettings(daySettings);
  }
  getDefault(): Day {
    return this.refrenceDate.getDay() as Day;
  }
  getAliases(): { [key: string]: Day; } {
    const relativeDays = Object.entries(this.relativeDaysSettings).map(([key, value]) => {
      const day = this.computeRelativeDay(value);
      return [key, day] as [string, Day];
    });
    const absoluteDays = Object.entries(this.daySettings);

    const allAliases: {[key: string]: Day} = {};
    for (let [key, value] of absoluteDays) {
      allAliases[key] = value;
    }
    for (let [key, value] of relativeDays) {
      allAliases[key] = value;
    }
    return allAliases;
  }
  computeRelativeDay(RelativeDay: RelativeDay): Day {
    let day = this.refrenceDate.getDay(); 
    day += RelativeDay;
    day = (day + 7) % 7;
    return day as Day;
  }
}

export class AmountRegExGroup extends RegExGroupBase<number> {
  constructor(
    readonly defaultAmount: number,
    groupName: string
  ) {
    super(groupName);
  }
  override getValue(matchGroups: { [key: string]: string }): number {
    const alias = matchGroups[this.groupName];
    if (!alias) return this.defaultAmount;
    const value = parseInt(alias);
    if (isNaN(value)) return this.defaultAmount;
    return value;
  }
  override getRegexOptions(): string {
    return '[0-9]+';
  }
}

export class TimeRegExGroup extends RegExGroupBase<Time> {
  constructor (
    readonly refrenceTime: Time,
    groupName: string
  ) {super(groupName);}
  getDefault(): Time {
    return this.refrenceTime;
  }
  getValue(matchGroups: { [key: string]: string }): Time {
    const alias = matchGroups[this.groupName];
    if (!alias) return this.getDefault();
    const regex = new RegExp(this.getRegexOptions());
    const match = alias.match(regex);
    if (!match) return this.getDefault();

    let [hoursStr, minutesStr, ampm] = match.slice(1);
    let hours = parseInt(hoursStr);
    let minutes = minutesStr ? parseInt(minutesStr) : 0;
    if (ampm === 'pm' && hours < 12) {
      hours += 12;
    }
    return new Time(hours, minutes);
  }
  getRegexOptions(): string {
    return '([0-9]{1,2}):?([0-9]{1,2})?\\s*(am|pm)?';
  }
}

export class AbsoluteRegExGroup implements RegExGroup<DayDelta> {
  constructor(
    readonly deltaIfAbsent: DayDelta,
    readonly groupName: string,
    readonly directionParser: RegExGroup<Direction>,
    readonly dayParser: RegExGroup<Day>,
    readonly currentDay: Day,
  ){ }
  getValue(matchGroups: { [key: string]: string; }): DayDelta {
    const match = matchGroups[this.groupName];
    if (!match) return this.deltaIfAbsent;
    const direction = this.directionParser.getValue(matchGroups);
    const day = this.dayParser.getValue(matchGroups);
    let delta = direction;
    while ((this.currentDay + delta) % 7 !== day) {
      delta += direction;
    }
    return new DayDelta(delta);
  }
  getRegexString(): string {
    return `(?<${this.groupName}>${this.directionParser.getRegexString()}\\s*${this.dayParser.getRegexString()})?`;
  }

}

export class RelativeRegExGroup implements RegExGroup<DayDelta> {
  constructor(
    readonly deltaIfAbsent: DayDelta,
    readonly groupName: string,
    readonly signParser: RegExGroup<Sign>,
    readonly amountParser: RegExGroup<number>,
    readonly multiplierParser: RegExGroup<Multiplier>,
  ) { }
  getValue(matchGroups: { [key: string]: string; }): DayDelta {
    const match = matchGroups[this.groupName];
    if (!match) return this.deltaIfAbsent;
    const sign = this.signParser.getValue(matchGroups);
    const amount = this.amountParser.getValue(matchGroups);
    const multiplier = this.multiplierParser.getValue(matchGroups);
    const delta = sign * amount * multiplier;
    return new DayDelta(delta);
  }
  getRegexString(): string {
    return `(?<${this.groupName}>${this.signParser.getRegexString()}\\s*${this.amountParser.getRegexString()}\\s*${this.multiplierParser.getRegexString()})?`;
  }
}

export class DateRegExGroup implements RegExGroup<Date> {
  constructor(
    readonly absoluteParser: RegExGroup<DayDelta>,
    readonly relativeParser: RegExGroup<DayDelta>,
    readonly groupName: string,
    readonly refrenceDate: Date
  ) { }

  getValue(matchGroups: { [key: string]: string; }) {
    const match = matchGroups[this.groupName];
    if (!match) return new Date(this.refrenceDate);
    const absoluteDelta = this.absoluteParser.getValue(matchGroups);
    const relativeDelta = this.relativeParser.getValue(matchGroups);
    const totalDelta = absoluteDelta.days + relativeDelta.days;

    const date = new Date(this.refrenceDate);
    date.setDate(date.getDate() + totalDelta);
    return date;
  }
  getRegexString(): string {
    return `(?<${this.groupName}>${this.absoluteParser.getRegexString()}\\s*${this.relativeParser.getRegexString()})?`;
  }
}

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

