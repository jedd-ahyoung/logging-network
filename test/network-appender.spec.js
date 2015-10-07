import {NetworkAppender} from '../src/index';
import {HttpClient} from 'aurelia-http-client';

describe('network appender', () => {
  let logger;
  let appender;

  beforeEach(() => {
    logger = {id:'test logger'};
    appender = new NetworkAppender();
  });

  it('can debug', () => {
    appender.debug(logger, 'test debug message');
  });

  it('can warn', () => {
    appender.warn(logger, 'test warn message');
  });

  it('can info', () => {
    appender.info(logger, 'test info message');
  });

  it('can error', () => {
    appender.error(logger, 'test error message');
  });
});
