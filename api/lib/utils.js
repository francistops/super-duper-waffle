export function catchMsg(name, place, errorObj, errorToClient, res, errorHttp, result) {
        // server error
        console.error(`Error fetching ${name}: ${errorObj.message}`);

        // client visible error
        result.message = `${place} ${errorObj}`;
        result.errorCode = errorToClient;
        res.status(errorHttp);
}

export function cl(fileName, fname, ...value ) {
        console.log(`--- at ${fileName} in ${fname} : ${value.join(",")} ---`)
}


// wip
//use this helper to call model fn
// ex: callModel(req, res, 69, debugFetchAllTasks, req.user.id);
export async function callModel(res, dbErrorCode, modelFn, ...reqObjs) {
    let result = UNKNOWN_ERROR;

    try {
        const data = await modelFn(...reqObjs);
        result = {
            message: 'Success',
            errorCode: 0,
            rows: data
        };
    } catch (error) {
        catchMsg('Tasks', 'Database', error, dbErrorCode, 500, result, res);
    }

    res.formatView(result);
};

async function buildModelCall(res, req, modelFn, ...reqObjs) {
    let result = UNKNOWN_ERROR;

    try {
        const data = await modelFn(...reqObjs);
        result = {
            message: 'Success',
            errorCode: 0,
            rows: data
        };
    } catch (error) {
        catchMsg('Tasks', 'Database', error, dbErrorCode, 500, result, res);
    }

    res.formatView(result);
}