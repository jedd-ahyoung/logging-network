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
