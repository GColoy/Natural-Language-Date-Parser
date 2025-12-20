import assert from "assert";
import test from "node:test";
import { parseDate } from "../src/dateParser";

test("common input testing", async (TestContext) => {
  const refrenceDate = new Date("Mon Dec 20 2025 14:31:00 GMT+0100");
  const testStrings: {input: string, output: Date}[] = [
    {input: "next monday 14:30", output: new Date("Mon Dec 22 2025 14:30:00 GMT+0100")},
    {input: "letzter freitag 9am", output: new Date("Fri Dec 19 2025 09:00:00 GMT+0100")},
    {input: "in 3 days", output: new Date("Tue Dec 23 2025 14:31:00 GMT+0100")},
    {input: "vor 2 wochen 18:00", output: new Date("Sat Dec 06 2025 18:00:00 GMT+0100")},
    {input: "tomorrow", output: new Date("Sun Dec 21 2025 14:31:00 GMT+0100")},
    {input: "gestern 12:15pm", output: new Date("Fri Dec 26 2025 12:15:00 GMT+0100")},
    {input: "nächster sonntag", output: new Date("Sun Dec 21 2025 14:31:00 GMT+0100")},
    {input: "in 1 month 08:00", output: new Date("Mon Jan 19 2026 08:00:00 GMT+0100")},
  ];

  for (let {input, output} of testStrings) {
    // Assuming there's a function parseDate(input) that returns a Date
    await TestContext.test(
      input,
      async () => {
        const parsedDate = parseDate(input, refrenceDate);
        assert.deepEqual(parsedDate, output);
      }
    )
  }
})
