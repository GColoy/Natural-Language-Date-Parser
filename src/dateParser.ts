import { AbsoluteRegExGroup, AmountRegExGroup, BasicPropertieRegExGroup, DateDefaults, DateRegExGroup, DayRegExGroup, FullDateAliasSettings, RelativeRegExGroup} from "./natural_language_date/dateRegEx";
import { RegExGroup } from "./regExGroup";
import { Direction, Sign, Multiplier, DayDelta } from "./natural_language_date/dateProperties";
import { Time } from "./time/timeProperties";
import { DateTimeRegExGroup } from "./DateTimeRegEx";
import { TimeRegExGroup } from "./time/timeRegEx";

export class DateTimeParser implements RegExGroup<Date> {
  readonly parser: DateTimeRegExGroup;
  constructor(
    dateParser: RegExGroup<Date>,
    timeParser: RegExGroup<Time>
  ) {
    this.parser = new DateTimeRegExGroup(
      dateParser,
      timeParser,
      "main"
    );
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
}
