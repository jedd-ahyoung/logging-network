declare module 'aurelia-logging-network' {
  import { DOM }  from 'aurelia-pal';
  import { Logger }  from 'aurelia-logging';
  export class NetworkAppenderBuilder {
    constructor(networkAppender: any);
    client(http: any): any;
    endpoint(endpoint: any): any;
  }
  export class NetworkAppenderQueue {
    constructor(queue?: any);
    add(item: any): any;
    drain(): any;
  }
  
  /* */
  /*
   * An implementation of the Appender interface.
   */
  export class NetworkAppender {
    constructor();
    
    /**
    	* Appends a debug log.
    	*
    	* @param logger The source logger.
    	* @param rest The data to log.
    	*/
    debug(logger: Logger, ...rest: any[]): void;
    
    /**
    	* Appends an info log.
    	*
    	* @param logger The source logger.
    	* @param rest The data to log.
    	*/
    info(logger: Logger, ...rest: any[]): void;
    
    /**
    	* Appends a warning log.
    	*
    	* @param logger The source logger.
    	* @param rest The data to log.
    	*/
    warn(logger: Logger, ...rest: any[]): void;
    
    /**
    	* Appends an error log.
    	*
    	* @param logger The source logger.
    	* @param rest The data to log.
    	*/
    error(logger: Logger, ...rest: any[]): void;
  }
}