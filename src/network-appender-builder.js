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
