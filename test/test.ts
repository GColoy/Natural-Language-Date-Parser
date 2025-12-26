import assert from "assert";
import test from "node:test";
import { DateParser } from "../src/dateParser";
import { dateDefaults, English, German } from "../src/data";

test("common input testing", async (TestContext) => {
  const refrenceDate = new Date("Mon Dec 20 2025 14:31:00 GMT+0100");
  const germanTestStrings: {input: string, output: Date}[] = [
    {input: "gestern 12:15pm", output: new Date("Fri Dec 26 2025 12:15:00 GMT+0100")},
    {input: "letzter freitag 9am", output: new Date("Fri Dec 19 2025 09:00:00 GMT+0100")},
    {input: "vor 2 wochen 18:00", output: new Date("Sat Dec 06 2025 18:00:00 GMT+0100")},
    {input: "nächster sonntag", output: new Date("Sun Dec 21 2025 14:31:00 GMT+0100")},
  ];
  const EnglishTestsStrings = [
    {input: "in 3 days", output: new Date("Tue Dec 23 2025 14:31:00 GMT+0100")},
    {input: "next monday 14:30", output: new Date("Mon Dec 22 2025 14:30:00 GMT+0100")},
    {input: "tomorrow", output: new Date("Sun Dec 21 2025 14:31:00 GMT+0100")},
    {input: "in 1 month 08:00", output: new Date("Mon Jan 19 2026 08:00:00 GMT+0100")},
  ];


  const EnglischParser = new DateParser(
    new Date(refrenceDate),
    English,
    dateDefaults
  );

  const GermanParser = new DateParser(
    new Date(refrenceDate),
    German,
    dateDefaults
  )

  await TestContext.test(
    "input Date",
    async () => {
      console.log(refrenceDate.toString());
      assert.deepEqual(refrenceDate, new Date(refrenceDate));
    }
  )

  await TestContext.test(
    "input not today",
    async () => {
      assert.notEqual(refrenceDate, new Date());
    }
  )

  for (let {input, output} of germanTestStrings) {
    // Assuming there's a function parseDate(input) that returns a Date
    await TestContext.test(
      input,
      async () => {
        const parsedDate = GermanParser.parseDate(input);
        assert.deepEqual(parsedDate, output);
      }
    )
  }
  for (let {input, output} of EnglishTestsStrings) {
    // Assuming there's a function parseDate(input) that returns a Date
    await TestContext.test(
      input,
      async () => {
        const parsedDate = EnglischParser.parseDate(input);
        assert.deepEqual(parsedDate, output);
      }
    )
  }
})
