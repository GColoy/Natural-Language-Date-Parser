import { dateDefaults } from "./data";
import { DayDelta, Direction, Multiplier, Sign } from "./dateProperties";
import { AbsoluteRegExGroup, AmountRegExGroup, BasicPropertieRegExGroup, DateDefaults, DateRegExGroup, DayRegExGroup, FullDateAliasSettings, RelativeRegExGroup } from "./dateRegEx";

export function parserConfig(settings: FullDateAliasSettings, groupPrefix: string, defaults?: DateDefaults, refrenceDate?: Date): DateRegExGroup {
  defaults = defaults ?? dateDefaults;
  refrenceDate = refrenceDate ?? new Date();

  const multiplierParser = new BasicPropertieRegExGroup<Multiplier>(
    defaults.multiplier,
    settings.multiplier,
    `${groupPrefix}_Date_Relative_Multiplier`
  );
  const amountParser = new AmountRegExGroup(
    1,
    `${groupPrefix}_Date_Relative_Amount`
  );
  const signParser = new BasicPropertieRegExGroup<Sign>(
    defaults.sign,
    settings.sign,
    `${groupPrefix}_Date_Relative_Sign`
  );
  const directionParser = new BasicPropertieRegExGroup<Direction>(
    defaults.direction,
    settings.direction,
    `${groupPrefix}_Date_Absolute_Direction`
  );
  const dayParser = new DayRegExGroup(
    refrenceDate,
    `${groupPrefix}_Date_Absolute_Day`,
    settings.relativeDays,
    settings.day
  );
  const relativeParser = new RelativeRegExGroup(
    new DayDelta(0),
    `${groupPrefix}_Date_Relative`,
    signParser,
    amountParser,
    multiplierParser
  );
  const absoluteParser = new AbsoluteRegExGroup(
    new DayDelta(0),
    `${groupPrefix}_Date_Absolute`,
    directionParser,
    dayParser,
    refrenceDate.getDay()
  );
  const dateParser = new DateRegExGroup(
    absoluteParser,
    relativeParser,
    `${groupPrefix}_Date`,
    refrenceDate
  );
  return dateParser;
}