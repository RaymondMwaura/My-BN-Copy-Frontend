let EVENTS = {};

const emit = (event, ...args) => {
	EVENTS[event].forEach(func => func(...args));
};

export const socket = {
	on: (event, func) => {
		if (EVENTS[event]) {
			return EVENTS[event].push(func);
		}
		EVENTS[event] = [func];
	},
	emit,
	disconnect: () => {},
};

export const io = {
	connect() {
		return socket;
	},
};

// to emulate server emit.
export const serverSocket = { emit }; // cleanup helper

export const cleanUp = () => {
	EVENTS = {};
};

export default io;
