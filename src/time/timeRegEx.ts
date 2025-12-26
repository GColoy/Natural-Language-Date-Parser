import { RegExGroupBase } from "../regExGroup";
import { Time } from "./timeProperties";

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

