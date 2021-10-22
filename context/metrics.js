import logger from './logger';
class Metrics {
  constructor() {
    this._keyMetricsCallback = undefined;
  }

  get keyMetricsCallback() {
    return this._keyMetricsCallback;
  }

  set keyMetricsCallback(value) {
    if (-1 < ['undefined', 'function'].indexOf(typeof value)) {
      this._keyMetricsCallback = value;
      return;
    }
    logger.warn(
      `context keyMetricsCallback expected a function. Received ${typeof value}`
    );
  }
}

export default new Metrics();
