import { sendSuccess, makeError } from "../utils/resultFactory.js";

export function catchMsg(
	name,
	errorObj = error,
	res = res,
	result = result,
	errorHttp = 500
) {
	// server error
	console.error(`Error at ${name}: ${errorObj.message}`);

	// client visible error
	result.message = `Error at ${name} ${errorObj}`;
	result.errorCode = errorHttp;
	res.status(errorHttp);
	res.formatView(result);
}

export function cl(fileName, fname, ...value) {
	console.log(`--- at ${fileName} in ${fname} : ${value.join(",")} ---`);
}

export async function callModel(
	res,
	dbErrorCode,
	modelFn,
	dataKey = "rows",
	...reqObjs
) {
	console.error("callModel called with: ", modelFn, reqObjs);
	try {
		const data = await modelFn(...reqObjs);
		console.error("callModel data: ", data);
		return sendSuccess(res, { [dataKey]: data });
	} catch (error) {
		const result = makeError();
		catchMsg("callModel", error, res, result, dbErrorCode);
	}
}

export function assertSameUserOrThrow(requestedUserId, tokenUserId) {
	if (requestedUserId !== tokenUserId) {
		const err = new Error("User mismatch: unauthorized");
		err.statusCode = 403;
		throw err;
	}
}
