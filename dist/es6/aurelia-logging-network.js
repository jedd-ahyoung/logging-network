import {DOM} from 'aurelia-pal';
import {Logger} from 'aurelia-logging';

export class NetworkAppenderBuilder {
	constructor (networkAppender) {
		this.networkAppender = networkAppender;
	}

	client (http) {
		this.networkAppender.http = http;
		return this;
	}

	endpoint (endpoint) {
		this.networkAppender.endpoint = endpoint;
		return this;
	}
}

export class NetworkAppenderQueue {
	constructor (queue = []) {
		this.queue = queue;
	}

	add (item) {
		return Promise.resolve(this.queue.push(item));
	}

	drain () {
		let drained = this.queue.splice(0, this.queue.length);
		return drained;
	}
}

// For the time being, I'm not sure how to use aurelia-pal. Just use the window element instead.
let dom = {
	addEventListener: DOM.addEventListener || window.addEventListener,
	removeEventListener: DOM.removeEventListener || window.removeEventListener
};

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
	if (!this.http.isRequesting) {
		this.http.post(this.endpoint, this.queue.drain());
		return;
	}

	let networkAppender = this;
	dom.addEventListener('aurelia-http-client-requests-drained', function sendLogs () {
		networkAppender.http.post(networkAppender.endpoint, networkAppender.queue.drain());
		dom.removeEventListener('aurelia-http-client-requests-drained', sendLogs);
	});
};
