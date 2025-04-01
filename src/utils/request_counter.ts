export class RequestCounter {
  private requestCounts: { [key: string]: number } = {};
  private readonly TIME_LIMIT: number;

  constructor(timeLimit = 2000) {
    this.TIME_LIMIT = timeLimit;
  }

  public getCount(key: string): number {
    return this.requestCounts[key] || 0;
  }

  public log(key: string) {
    if (!this.requestCounts[key]) {
      this.requestCounts[key] = 0;
    }
    this.requestCounts[key]++;
    setTimeout(() => {
      this.requestCounts[key] = 0;
    }, this.TIME_LIMIT);
    console.log(
      `You are hitting this endpoint 👉 ${key} 👈${
        this.requestCounts[key] || 0
      }`
    );
  }
}
