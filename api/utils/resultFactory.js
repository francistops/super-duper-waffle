export function makeSuccess(data = {}) {
    return {
        message: 'Success',
        errorCode: 0,
        ...data
    };
}

export function makeError(message = 'Unknown Error', errorCode = 9999) {
    return {
        message: message,
        errorCode: errorCode
    };
}