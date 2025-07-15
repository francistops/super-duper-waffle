export function makeSuccess(data = {}, message = "Success") {
    return {
        message: message,
        errorCode: 0,
        ...data
    };
}

export function makeError(message = 'Unknown Error', errorCode = 9999) {
	return {
		message,
		errorCode
	};
}

export function sendSuccess(res, data = {}) {
	res.formatView(makeSuccess(data));
}

export function sendError(res, status, message = 'Unknown Error', errorCode = status) {
	res.status(status).formatView(makeError(message, errorCode));
}