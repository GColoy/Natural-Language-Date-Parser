import { AbsoluteRegExGroup, AmountRegExGroup, BasicPropertieRegExGroup, DateRegExGroup, DateTimeRegExGroup, DayRegExGroup, RelativeRegExGroup, TimeRegExGroup } from "./dateRegEx";
import { RegExSetting } from "./regExGroup";
import { Direction, Day, RelativeDay, Sign, Multiplier, DayDelta, Time } from "./dateProperties";

const directionSettings: RegExSetting<Direction> = {
  default: Direction.Forward,
  aliases: {
    'next': Direction.Forward,
    'nächster': Direction.Forward,
    'last': Direction.Backward,
    'letzter': Direction.Backward
  }
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

const signSettings: RegExSetting<Sign> = {
  default: Sign.Forward,
  aliases: {
    'innerhalb': Sign.Forward,
    'in': Sign.Forward,
    'before': Sign.Back,
    'vor': Sign.Back
  }
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

export function parseDate(dateString: string, refrenceDate?: Date): Date {
  refrenceDate = refrenceDate ?? new Date();
  const parser = parserConfig(refrenceDate);
  
  const fullRegexString = `^\\s*${parser.getRegexString()}\\s*$`;
  const fullRegex = new RegExp(fullRegexString, 'i');
  const match = dateString.match(fullRegex);
  if (!match || !match.groups) {
    throw new Error(`Could not parse date string: ${dateString}`);
  }
  const resultDate = parser.getValue(match.groups);
  if (!resultDate) {
    throw new Error(`Could not parse date string: ${dateString}`);
  }
  return resultDate;
}

export function parserConfig(refrenceDate: Date) {
  const multiplierParser = new BasicPropertieRegExGroup<Multiplier>(
    multiplierSettings.default,
    multiplierSettings.aliases,
    "main_Date_Relative_Multiplier"
  );
  const amountParser = new AmountRegExGroup(
    1,
    "main_Date_Relative_Amount"
  );
  const signParser = new BasicPropertieRegExGroup<Sign>(
    signSettings.default,
    signSettings.aliases,
    "main_Date_Relative_Sign"
  );
  const directionParser = new BasicPropertieRegExGroup<Direction>(
    directionSettings.default,
    directionSettings.aliases,
    "main_Date_Absolute_Direction"
  );
  const dayParser = new DayRegExGroup(
    refrenceDate,
    "main_Date_Absolute_Day",
    relativeDaysSettings.aliases,
    daySettings.aliases
  );
  const relativeParser = new RelativeRegExGroup(
    new DayDelta(0),
    "main_Date_Relative",
    signParser,
    amountParser,
    multiplierParser
  );
  const absoluteParser = new AbsoluteRegExGroup(
    new DayDelta(0),
    "main_Date_Absolute",
    directionParser,
    dayParser,
    refrenceDate.getDay()
  );
  const dateParser = new DateRegExGroup(
    absoluteParser,
    relativeParser,
    "main_Date"
  );
  const timeParser = new TimeRegExGroup(
    new Time(refrenceDate.getHours(), refrenceDate.getMinutes()),
    "main_Time"
  );
  const parser = new DateTimeRegExGroup(
    dateParser,
    timeParser,
    "main"
  );
  return parser;
}
