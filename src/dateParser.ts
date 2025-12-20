type RegExSetting<T> = {default: T, aliases: {[key: string]: T}};
interface RegExGroup<T> {
  getValue(alias: string | undefined): T;
  getRegexString(name: string): string;
}
abstract class RegExGroupBase<T> implements RegExGroup<T> {
  abstract getValue(alias: string | undefined): T;
  abstract getRegexOptions(): string;
  getRegexString(name: string): string {
    return `(?<${name}>${this.getRegexOptions()})?`;
  }
}

class SimpleRegExGroup<T> extends RegExGroupBase<T> {
  constructor(
    readonly getAliases: () => {[key: string]: T},
    readonly getDefault: () => T
  ) {
    super();
  }

  getValue(alias: string | undefined): T {
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

enum Direction {
  Forward = 1,
  Backward = -1
}
const directionSettings: RegExSetting<Direction> = {
  default: Direction.Forward,
  aliases: {
    'next': Direction.Forward,
    'nächster': Direction.Forward,
    'last': Direction.Backward,
    'letzter': Direction.Backward
  }
}
const directionAliases = new SimpleRegExGroup<Direction> (
  () => directionSettings.aliases,
  () => directionSettings.default
);

enum Day {
  Sunday = 0,
  Monday,
  Tuesday,
  Wednesday,
  Thursday,
  Friday,
  Saturday
}
const daySettings: RegExSetting<Day> = {
  default: Day.Monday,
  aliases: {
    'monday': Day.Monday,
    'montag': Day.Monday,
    'tuesday': Day.Tuesday,
    'dienstag': Day.Tuesday,
    'wednesday': Day.Wednesday,
    'mittwoch': Day.Wednesday,
    'thursday': Day.Thursday,
    'donnerstag': Day.Thursday,
    'friday': Day.Friday,
    'freitag': Day.Friday,
    'saturday': Day.Saturday,
    'samstag': Day.Saturday,
    'sunday': Day.Sunday,
    'sonntag': Day.Sunday,

    'mon': Day.Monday,
    'tue': Day.Tuesday,
    'wed': Day.Wednesday,
    'thu': Day.Thursday,
    'fri': Day.Friday,
    'sat': Day.Saturday,
    'sun': Day.Sunday,

    'mo': Day.Monday,
    'tu': Day.Tuesday,
    'we': Day.Wednesday,
    'th': Day.Thursday,
    'fr': Day.Friday,
    'sa': Day.Saturday,
    'su': Day.Sunday,
  }
}

enum RelativeDay {
  Yesterday = -1,
  Today = 0,
  Tomorrow = 1
}
const relativeDaysSettings: RegExSetting<RelativeDay> = {
  default: RelativeDay.Today,
  aliases: {
    'yesterday': RelativeDay.Yesterday,
    'gestern': RelativeDay.Yesterday,
    'today': RelativeDay.Today,
    'heute': RelativeDay.Today,
    'tomorrow': RelativeDay.Tomorrow,
    'morgen': RelativeDay.Tomorrow
  }
}
function computeRelativeDay(RelativeDay: RelativeDay, date?: Date): Day {
  date = date ?? new Date();
  let day = date.getDay(); 
  day += RelativeDay;
  day = (day + 7) % 7;
  return day as Day;
}
const dayAliases = new SimpleRegExGroup<Day>(
  () => {
    const relativeDays = Object.entries(relativeDaysSettings.aliases).map(([key, value]) => {
      const day = computeRelativeDay(value);
      return [key, day] as [string, Day];
    });
    const allAliases: {[key: string]: Day} = {};
    for (let [key, value] of Object.entries(daySettings.aliases)) {
      allAliases[key] = value;
    }
    for (let [key, value] of relativeDays) {
      allAliases[key] = value;
    }
    return allAliases;
  },
  () => { 
    const today = computeRelativeDay(relativeDaysSettings.default!);
    return today;
  }
);

enum Sign {
  Back = -1,
  Forward = 1
}
const signSettings: RegExSetting<Sign> = {
  default: Sign.Forward,
  aliases: {
    'innerhalb': Sign.Forward,
    'in': Sign.Forward,
    'before': Sign.Back,
    'vor': Sign.Back
  }
}
const signAliases = new SimpleRegExGroup<Sign>(
  () => signSettings.aliases,
  () => signSettings.default
);

enum Multiplier {
  Day = 1,
  Week = 7,
  Month = 30,
  Year = 365
}
const multiplierSettings: RegExSetting<Multiplier> = {
  default: Multiplier.Day,
  aliases: {
    'days': Multiplier.Day,
    'day': Multiplier.Day,
    'tage': Multiplier.Day,
    'tag': Multiplier.Day,
    'weeks': Multiplier.Week,
    'week': Multiplier.Week,
    'wochen': Multiplier.Week,
    'woche': Multiplier.Week,
    'months': Multiplier.Month,
    'month': Multiplier.Month,
    'monate': Multiplier.Month,
    'monat': Multiplier.Month,
    'years': Multiplier.Year,
    'year': Multiplier.Year,
    'jahre': Multiplier.Year,
    'jahr': Multiplier.Year,
  }
}
const multiplierAliases = new SimpleRegExGroup<Multiplier>(
  () => multiplierSettings.aliases,
  () => multiplierSettings.default
);

class AmountAliases extends RegExGroupBase<number> {
  constructor(
    readonly defaultAmount: number,
  ) {
    super();
  }
  override getValue(alias: string | undefined): number {
    if (!alias) return this.defaultAmount;
    const value = parseInt(alias);
    if (isNaN(value)) return this.defaultAmount;
    return value;
  }
  override getRegexOptions(): string {
    return '[0-9]+';
  }
}
const amountAliases = new AmountAliases(1);

class Time {
  constructor(
    readonly hours: number,
    readonly minutes: number,
  ){}
  getMinutesFromMidnight(): number {
    return this.hours * 60 + this.minutes;
  }
}
class TimeAliases extends RegExGroupBase<Time> {
  getDefault(): Time {
    const date = new Date();
    return new Time(date.getHours(), date.getMinutes());
  }
  getValue(alias: string | undefined): Time {
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
const timeAliases = new TimeAliases();

export const absolutRegExString = 
  '^\\s*'+
  '(?<absolute>'+
  directionAliases.getRegexString('direction') +
  '\\s*'+
  dayAliases.getRegexString('day') +
  ')?'+
  '\\s*'+
  '(?<relative>'+
  signAliases.getRegexString('sign') +
  '\\s*'+
  amountAliases.getRegexString('amount') +
  '\\s*'+
  multiplierAliases.getRegexString('multiplier') +
  ')?'+
  '\\s*'+
  '(?:'+
  '(\\s+|^)'+
  timeAliases.getRegexString('time') +
  ')?'+
  '\\s*$';
export const dateMatchRegex = new RegExp(
  absolutRegExString,
  'i'
);

export function parseDate(dateString: string) {
  const match = dateString.match(dateMatchRegex);
  if (!match || !match.groups) {
    return null;
  }

  const {direction: directionMatch, day: dayMatch, sign: signMatch, amount: amountMatch, multiplier: multiplierMatch, time: timeMatch, absolute, relative} = match.groups;
  
  const sign = signAliases.getValue(signMatch);
  const amount = amountAliases.getValue(amountMatch);
  const multiplier = multiplierAliases.getValue(multiplierMatch);
  const direction = directionAliases.getValue(directionMatch);
  const day = dayAliases.getValue(dayMatch);
  const time = timeAliases.getValue(timeMatch);

  const date = new Date();
  if (relative) {
    const delta = sign * amount * multiplier;
    date.setDate(date.getDate() + delta);
  }
  if (absolute) {
    do {
      date.setDate(date.getDate() + Math.sign(direction));
    } while (date.getDay() !== day);
  }
  date.setHours(time.hours, time.minutes, 0, 0);
  return date;
}

function test() {
  const testStrings = [
    "next monday 14:30",
    "letzter freitag 9am",
    "in 3 days",
    "vor 2 wochen 18:00",
    "tomorrow",
    "gestern 12:15pm",
    "nächster sonntag",
    "in 1 month 08:00",
  ];
  for (const testString of testStrings) {
    const parsedDate = parseDate(testString);
    console.log(`Input: "${testString}" => Parsed Date: ${parsedDate}`);
  }
}
// Uncomment to run tests
test();
console.log("Date parser module loaded.");