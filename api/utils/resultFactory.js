<<<<<<< HEAD
export function makeSuccess(data = {}, message = "Success") {
    return {
        message: message,
        errorCode: 0,
        ...data
    };
=======
export function makeSuccess(data = {}) {
	return {
		message: 'Success',
		errorCode: 0,
		...data
	};
>>>>>>> 28127b2 (Sorry j'étais sur le main, check dans readme pour voir ce qui fonctionne, je viens de penser que dans appointment controller il faut que je gère que c'est un token de client qui peut add ou modify un appointment, je ne l'ai pas fais encore)
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