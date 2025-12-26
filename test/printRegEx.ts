import { dateDefaults, simpleDateAliasSettings } from "../src/data";
import { DateParser } from "../src/dateParser";

const Parser = new DateParser(
  new Date(),
  simpleDateAliasSettings,
  dateDefaults
)

console.log(
  Parser.getRegexString()
)