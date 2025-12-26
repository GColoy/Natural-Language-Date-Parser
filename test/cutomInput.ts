import { dateDefaults, English, German } from "../src/data";
import { DateParser } from "../src/dateParser";

const parser = new DateParser(
  new Date(),
  English,
  dateDefaults
);
const input = process.argv[2];
if (!input) throw new Error("No input provided");
const date = parser.parseDate(input);
console.log(date.toString());
