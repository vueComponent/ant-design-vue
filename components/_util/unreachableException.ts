export default class UnreachableException {
  error: Error;

  constructor(value: any) {
    this.error = new Error(`unreachable case: ${JSON.stringify(value)}`);
  }
}
