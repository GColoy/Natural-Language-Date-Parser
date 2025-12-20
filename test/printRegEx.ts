import { parserConfig } from "../src/dateParser";

console.log(
  parserConfig(new Date()).getRegexString()
)