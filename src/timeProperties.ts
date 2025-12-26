export class Time {
  constructor(
    readonly hours: number,
    readonly minutes: number,
  ){}
  getMinutesFromMidnight(): number {
    return this.hours * 60 + this.minutes;
  }
}

