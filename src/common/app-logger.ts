export default class AppLogger {
  protected localInstanceRef?: AppLogger;
  constructor() {
    if (!this.localInstanceRef) {
      this.localInstanceRef = this;
    }

    return this.localInstanceRef;
  }
}
