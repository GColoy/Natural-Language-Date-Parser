import { DateTimeParser } from "../src/dateParser"
import { dateDefaults, English, German } from "../src/natural_language_date/data"
import * as naturalLanguageParser from "../src/natural_language_date/parser";
import { MultiRegEx } from "../src/regExGroup";
import * as timeParser from "../src/time/parser"

const refrenceDate = new Date();
const parser = new DateTimeParser(
  new MultiRegEx([
      naturalLanguageParser.parserConfig(German, "German"),
      naturalLanguageParser.parserConfig(English, "Englisch"),
    ],
    refrenceDate,
    "Multi"
  ),
  timeParser.parserConfig(refrenceDate)
)


console.log(
  parser.getRegexString()
)