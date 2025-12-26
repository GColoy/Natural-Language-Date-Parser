import { AbsoluteRegExGroup, AmountRegExGroup, BasicPropertieRegExGroup, DateDefaults, DateRegExGroup, DateTimeRegExGroup, DayRegExGroup, FullDateAliasSettings, RelativeRegExGroup, TimeRegExGroup } from "./dateRegEx";
import { RegExGroup } from "./regExGroup";
import { Direction, Sign, Multiplier, DayDelta } from "./dateProperties";
import { Time } from "./timeProperties";

export class DateParser implements RegExGroup<Date> {
  readonly parser: DateTimeRegExGroup;
  constructor(
    readonly refrenceDate: Date,
    settings: FullDateAliasSettings,
    defaults: DateDefaults
  ) {
    this.parser = DateParser.parserConfig(settings, defaults, this.refrenceDate);
  }

  public parseDate(dateString: string): Date {
    const fullRegex = this.getRegEx();

    const match = dateString.match(fullRegex);
    if (!match || !match.groups) {
      throw new Error(`Date String did not match: ${dateString}`);
    }
    const resultDate = this.getValue(match.groups);
    if (!resultDate) {
      throw new Error(`Could not parse date string: ${dateString}`);
    }
    return resultDate;
  }

  getValue(matchGroups: { [key: string]: string; }): Date {
    return this.parser.getValue(matchGroups);
  }


  private getRegEx() {
    const fullRegexString = this.getRegexString();
    const fullRegex = new RegExp(fullRegexString, 'i');
    return fullRegex;
  }

  getRegexString(): string {
    return `^\\s*${this.parser.getRegexString()}\\s*$`;
  }

  static parserConfig(settings: FullDateAliasSettings, defaults: DateDefaults,
  refrenceDate: Date): DateTimeRegExGroup {
    const multiplierParser = new BasicPropertieRegExGroup<Multiplier>(
      defaults.multiplier,
      settings.multiplier,
      "main_Date_Relative_Multiplier"
    );
    const amountParser = new AmountRegExGroup(
      1,
      "main_Date_Relative_Amount"
    );
    const signParser = new BasicPropertieRegExGroup<Sign>(
      defaults.sign,
      settings.sign,
      "main_Date_Relative_Sign"
    );
    const directionParser = new BasicPropertieRegExGroup<Direction>(
      defaults.direction,
      settings.direction,
      "main_Date_Absolute_Direction"
    );
    const dayParser = new DayRegExGroup(
      refrenceDate,
      "main_Date_Absolute_Day",
      settings.relativeDays,
      settings.day
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
      "main_Date",
      refrenceDate
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
}



