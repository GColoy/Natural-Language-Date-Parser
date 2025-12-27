import assert from "assert";
import test from "node:test";
import { DateTimeParser } from "../src/dateParser";
import { English, German } from "../src/natural_language_date/data";
import { MultiRegEx } from "../src/regExGroup";
import * as naturalLanguageParser from "../src/natural_language_date/parser";
import * as timeParser from "../src/time/parser"

test("common input testing", async (TestContext) => {
  const refrenceDate = new Date("Sat Dec 20 2025 14:31:00 GMT+0100");
  const TestStrings: {input: string, output: Date}[] = [
    {input: "in 3 days", output: new Date("Tue Dec 23 2025 14:31:00 GMT+0100")},
    {input: "next monday 14:30", output: new Date("Mon Dec 22 2025 14:30:00 GMT+0100")},
    {input: "tomorrow", output: new Date("Sun Dec 21 2025 14:31:00 GMT+0100")},
    {input: "in 1 month 08:00", output: new Date("Mon Jan 19 2026 08:00:00 GMT+0100")},
    {input: "gestern 12:15pm", output: new Date("Fri Dec 26 2025 12:15:00 GMT+0100")},
    {input: "letzter freitag 9am", output: new Date("Fri Dec 19 2025 09:00:00 GMT+0100")},
    {input: "vor 2 wochen 18:00", output: new Date("Sat Dec 06 2025 18:00:00 GMT+0100")},
    {input: "nächster sonntag", output: new Date("Sun Dec 21 2025 14:31:00 GMT+0100")},
  ];

  const parser = new DateTimeParser(
    new MultiRegEx([
      naturalLanguageParser.parserConfig(German, "German", undefined, refrenceDate),
        naturalLanguageParser.parserConfig(English, "Englisch", undefined, refrenceDate),
      ],
      refrenceDate,
      "Multi"
    ),
    timeParser.parserConfig(refrenceDate)
  )

  for (let {input, output} of TestStrings) {
    // Assuming there's a function parseDate(input) that returns a Date
    await TestContext.test(
      input,
      async () => {
        const parsedDate = parser.parseDate(input);
        assert.deepEqual(parsedDate, output);
      }
    )
  }
})
