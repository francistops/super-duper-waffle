export function makeSuccess(data = {}, message = "Success") {
    return {
        message: message,
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