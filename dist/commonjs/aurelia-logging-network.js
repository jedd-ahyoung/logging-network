'use strict';

exports.__esModule = true;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _aureliaPal = require('aurelia-pal');

var _aureliaLogging = require('aurelia-logging');

var NetworkAppenderBuilder = (function () {
	function NetworkAppenderBuilder(networkAppender) {
		_classCallCheck(this, NetworkAppenderBuilder);

		this.networkAppender = networkAppender;
	}

	NetworkAppenderBuilder.prototype.client = function client(http) {
		this.networkAppender.http = http;
		return this;
	};

	NetworkAppenderBuilder.prototype.endpoint = function endpoint(_endpoint) {
		this.networkAppender.endpoint = _endpoint;
		return this;
	};

	return NetworkAppenderBuilder;
})();

exports.NetworkAppenderBuilder = NetworkAppenderBuilder;

var NetworkAppenderQueue = (function () {
	function NetworkAppenderQueue() {
		var queue = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];

		_classCallCheck(this, NetworkAppenderQueue);

		this.queue = queue;
	}

	NetworkAppenderQueue.prototype.add = function add(item) {
		return Promise.resolve(this.queue.push(item));
	};

	NetworkAppenderQueue.prototype.drain = function drain() {
		var drained = this.queue.splice(0, this.queue.length);
		return drained;
	};

	return NetworkAppenderQueue;
})();

exports.NetworkAppenderQueue = NetworkAppenderQueue;

var dom = {
	addEventListener: _aureliaPal.DOM.addEventListener || window.addEventListener,
	removeEventListener: _aureliaPal.DOM.removeEventListener || window.removeEventListener
};

var NetworkAppender = (function () {
	function NetworkAppender() {
		_classCallCheck(this, NetworkAppender);

		this.queue = new NetworkAppenderQueue();
		this.pending = null;
	}

	NetworkAppender.prototype.debug = function debug(logger) {
		for (var _len = arguments.length, rest = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
			rest[_key - 1] = arguments[_key];
		}

		this.queue.add({
			type: 'debug',
			logger: logger.id,
			data: rest,
			timestamp: Date.now()
		}).then(this.send.bind(this));
	};

	NetworkAppender.prototype.info = function info(logger) {
		for (var _len2 = arguments.length, rest = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
			rest[_key2 - 1] = arguments[_key2];
		}

		this.queue.add({
			type: 'info',
			logger: logger.id,
			data: rest,
			timestamp: Date.now()
		}).then(this.send.bind(this));
	};

	NetworkAppender.prototype.warn = function warn(logger) {
		for (var _len3 = arguments.length, rest = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
			rest[_key3 - 1] = arguments[_key3];
		}

		this.queue.add({
			type: 'warn',
			logger: logger.id,
			data: rest,
			timestamp: Date.now()
		}).then(this.send.bind(this));
	};

	NetworkAppender.prototype.error = function error(logger) {
		for (var _len4 = arguments.length, rest = Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {
			rest[_key4 - 1] = arguments[_key4];
		}

		this.queue.add({
			type: 'error',
			logger: logger.id,
			data: rest,
			timestamp: Date.now()
		}).then(this.send.bind(this));
	};

	return NetworkAppender;
})();

exports.NetworkAppender = NetworkAppender;

NetworkAppender.prototype.configure = function (fn) {
	var builder = new NetworkAppenderBuilder(this);
	fn(builder);
	return this;
};

NetworkAppender.prototype.send = function () {
	if (!this.http.isRequesting) {
		this.http.post(this.endpoint, this.queue.drain());
		return;
	}

	var networkAppender = this;
	dom.addEventListener('aurelia-http-client-requests-drained', function sendLogs() {
		networkAppender.http.post(networkAppender.endpoint, networkAppender.queue.drain());
		dom.removeEventListener('aurelia-http-client-requests-drained', sendLogs);
	});
};