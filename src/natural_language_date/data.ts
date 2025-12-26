import { Direction, Day, RelativeDay, Sign, Multiplier} from "./dateProperties";
import { DateDefaults, FullDateAliasSettings } from "./dateRegEx";


// Defaults

export const dateDefaults: DateDefaults = {
  direction: Direction.Forward,
  relativeDays: RelativeDay.Today,
  sign: Sign.Forward,
  multiplier: Multiplier.Day
};

// Simple

export const simpleDateAliasSettings: FullDateAliasSettings = {
  direction: [
    {value:     Direction.Forward, 
     aliases:   ["next"]},
    {value:     Direction.Backward, 
     aliases:   ["last"]}
  ],
  day: [
    {value:     Day.Monday,
     aliases:   ["mon"]},
    {value:     Day.Tuesday, 
     aliases:   ["tue"]},
    {value:     Day.Wednesday, 
     aliases:   ["wed"]},
    {value:     Day.Thursday, 
     aliases:   ["thu"]},
    {value:     Day.Friday, 
     aliases:   ["fri"]},
    {value:     Day.Saturday, 
     aliases:   ["sat"]},
    {value:     Day.Sunday, 
     aliases:   ["sun"]}
  ],
  relativeDays: [
    {value:     RelativeDay.Today, 
     aliases:   ["today"]},
    {value:     RelativeDay.Yesterday, 
     aliases:   ["yesterday"]},
    {value:     RelativeDay.Tomorrow, 
     aliases:   ["tomorrow"]},
    {value:     RelativeDay.Week, 
     aliases:   ["week"]}
  ],
  sign: [
    {value:     Sign.Back, 
     aliases:   ["before"]},
    {value:     Sign.Forward, 
     aliases:   ["in"]}
  ],
  multiplier: [
    {value:     Multiplier.Day, 
     aliases:   ["d"]},
    {value:     Multiplier.Week, 
     aliases:   ["w"]},
    {value:     Multiplier.Month, 
     aliases:   ["m"]},
    {value:     Multiplier.Year, 
     aliases:   ["y"]},
  ]
};

// English

export const English: FullDateAliasSettings = {
  direction: [
    {value:     Direction.Forward, 
     aliases:   ["next", "coming", "following"]},
    {value:     Direction.Backward, 
     aliases:   ["last", "previous", "prev", "past"]},
  ],
  day: [
    {value:     Day.Monday, 
     aliases:   ["monday", "mon", "mo"]},
    {value:     Day.Tuesday, 
     aliases:   ["tuesday", "tue", "tu"]},
    {value:     Day.Wednesday, 
     aliases:   ["wednesday", "wed", "we"]},
    {value:     Day.Thursday, 
     aliases:   ["thursday", "thu", "th"]},
    {value:     Day.Friday, 
     aliases:   ["friday", "fri", "fr"]},
    {value:     Day.Saturday, 
     aliases:   ["saturday", "sat", "sa"]},
    {value:     Day.Sunday, 
     aliases:   ["sunday", "sun", "su"]},
  ],
  relativeDays: [
    {value:     RelativeDay.Today, 
     aliases:   ["today"]},
    {value:     RelativeDay.Yesterday, 
     aliases:   ["yesterday"]},
    {value:     RelativeDay.Tomorrow, 
     aliases:   ["tomorrow"]},
    {value:     RelativeDay.Week, 
     aliases:   ["week"]},
  ],
  sign: [
    {value:     Sign.Back, 
     aliases:   ["before", "last"]},
    {value:     Sign.Forward, 
     aliases:   ["in"]},
  ],
  multiplier: [
    {value:     Multiplier.Day, 
     aliases:   ["day", "days", "d"]},
    {value:     Multiplier.Week, 
     aliases:   ["week", "weeks", "w"]},
    {value:     Multiplier.Month, 
     aliases:   ["month", "months", "m"]},
    {value:     Multiplier.Year, 
     aliases:   ["year", "years", "y"]},
  ]
}

// German
export const German: FullDateAliasSettings = {
  direction: [
    {value:     Direction.Forward, 
     aliases:   ["nächster", "nächste", "nächstes", "kommender", "kommende", "kommendes"]},
    {value:     Direction.Backward, 
     aliases:   ["letzter", "letzte", "letztes", "voriger", "vorige", "voriges"]},
  ],
  day: [
    {value:     Day.Monday, 
     aliases:   ["montag", "mon", "mo"]},
    {value:     Day.Tuesday, 
     aliases:   ["dienstag", "die", "di"]},
    {value:     Day.Wednesday, 
     aliases:   ["mittwoch", "mit", "mi"]},
    {value:     Day.Thursday, 
     aliases:   ["donnerstag", "don", "do"]},
    {value:     Day.Friday, 
     aliases:   ["freitag", "fre", "fr"]},
    {value:     Day.Saturday, 
     aliases:   ["samstag", "sam", "sa"]},
    {value:     Day.Sunday, 
     aliases:   ["sonntag", "son", "so"]},
  ],
  relativeDays: [
    {value:     RelativeDay.Today, 
     aliases:   ["heute"]},
    {value:     RelativeDay.Yesterday, 
     aliases:   ["gestern"]},
    {value:     RelativeDay.Tomorrow, 
     aliases:   ["morgen"]},
    {value:     RelativeDay.Week, 
     aliases:   ["woche"]},
  ],
  sign: [
    {value:     Sign.Back, 
     aliases:   ["vor", "letzte", "letzter", "letztes"]},
    {value:     Sign.Forward, 
     aliases:   ["in", "nächste", "nächster", "nächstes"]},
  ],
  multiplier: [
    {value:     Multiplier.Day, 
     aliases:   ["tag", "tage", "t"]},
    {value:     Multiplier.Week, 
     aliases:   ["woche", "wochen", "w"]},
    {value:     Multiplier.Month, 
     aliases:   ["monat", "monate", "m"]},
    {value:     Multiplier.Year, 
     aliases:   ["jahr", "jahre", "y"]},
  ]
}