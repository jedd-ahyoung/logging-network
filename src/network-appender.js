/* import {DOM} from 'aurelia-pal'; */
import {Logger} from 'aurelia-logging';
import {NetworkAppenderQueue} from './network-appender-queue';
import {NetworkAppenderBuilder} from './network-appender-builder';

/*
 * An implementation of the Appender interface.
 */
export class NetworkAppender {
	constructor () {
		this.queue = new NetworkAppenderQueue();
		this.pending = null;
	}

	/**
	* Appends a debug log.
	*
	* @param logger The source logger.
	* @param rest The data to log.
	*/
	debug (logger: Logger, ...rest : any[]): void {
		this.queue.add({
			type: 'debug',
			logger: logger.id,
			data: rest,
			timestamp: Date.now()
		})
			.then(this.send.bind(this));
	}

	/**
	* Appends an info log.
	*
	* @param logger The source logger.
	* @param rest The data to log.
	*/
	info (logger: Logger, ...rest : any[]): void {
		this.queue.add({
			type: 'info',
			logger: logger.id,
			data: rest,
			timestamp: Date.now()
		})
			.then(this.send.bind(this));
	}

	/**
	* Appends a warning log.
	*
	* @param logger The source logger.
	* @param rest The data to log.
	*/
	warn (logger: Logger, ...rest : any[]): void {
		this.queue.add({
			type: 'warn',
			logger: logger.id,
			data: rest,
			timestamp: Date.now()
		})
			.then(this.send.bind(this));
	}

	/**
	* Appends an error log.
	*
	* @param logger The source logger.
	* @param rest The data to log.
	*/
	error (logger: Logger, ...rest : any[]): void {
		this.queue.add({
			type: 'error',
			logger: logger.id,
			data: rest,
			timestamp: Date.now()
		})
			.then(this.send.bind(this));
	}
}

NetworkAppender.prototype.configure = function (fn) {
	let builder = new NetworkAppenderBuilder(this);
	fn(builder);
	return this;
};

NetworkAppender.prototype.send = function () {
	// For the time being, I'm not sure how to use aurelia-pal. Just use the window element instead.
	function sendLogs () {
		window.removeEventListener('aurelia-http-client-requests-drained', sendLogs);
		networkAppender.http.post(networkAppender.endpoint, networkAppender.queue.drain())
			.then(() => {
				networkAppender.isPending = false;
			})
			.catch(() => void(0));
	}

	let networkAppender = this;

	if (!this.http.isRequesting) {
		sendLogs();
		return;
	}

	if (!this.isPending) {
		this.isPending = true;
		window.addEventListener('aurelia-http-client-requests-drained', sendLogs);
	}
};
