export const timeS = {
  millisecondsToStandard(mils: number): number {
    // seconds is standard
    return Math.floor(mils / 1000);
  },
  now() {
    return this.millisecondsToStandard(Date.now());
  },
  standardToMilliSeconds(standard: number): number {
    return standard * 1000;
  },
  oneDay: 86400,
  get thirtyDays(): number {
    return this.oneDay * 30;
  },
  get hundredsOfYearsFromNow() {
    return 11661201881;
  },
  async delay(milliseconds: number) {
    return new Promise((resolve) => {
      setTimeout(resolve, milliseconds);
    });
  },
  isTimestamp(value: any): value is number {
    return typeof value === "number";
  }
} as const;