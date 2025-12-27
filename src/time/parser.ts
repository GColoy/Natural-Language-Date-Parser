import { Time } from "./timeProperties";
import { TimeRegExGroup } from "./timeRegEx";

export function parserConfig(refrenceTime: Date) {
  return new TimeRegExGroup(
    new Time(refrenceTime.getHours(), refrenceTime.getMinutes()),
    "Time"
  )
}