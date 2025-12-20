export enum Direction {
  Forward = 1,
  Backward = -1
}

export enum Day {
  Sunday = 0,
  Monday,
  Tuesday,
  Wednesday,
  Thursday,
  Friday,
  Saturday
}

export enum RelativeDay {
  Yesterday = -1,
  Today = 0,
  Tomorrow = 1
}

export enum Sign {
  Back = -1,
  Forward = 1
}

export enum Multiplier {
  Day = 1,
  Week = 7,
  Month = 30,
  Year = 365
}

export class Time {
  constructor(
    readonly hours: number,
    readonly minutes: number,
  ){}
  getMinutesFromMidnight(): number {
    return this.hours * 60 + this.minutes;
  }
}

export class DayDelta {
  constructor(
    readonly days: number
  ){}
}

export class AbsoluteDate {
  constructor(
    readonly Direction: Direction,
    readonly Day: Day
  ){}
}

export class RelativeDate {
  constructor(
    readonly Sign: Sign,
    readonly Amount: number,
    readonly Multiplier: Multiplier
  ){}
}