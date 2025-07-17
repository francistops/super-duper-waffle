import { sendSuccess, sendError } from "../utils/resultFactory.js";

export function catchMsg(name, errorObj, res, errorHttp = 500) {
	console.error(`Error at ${name}: ${errorObj?.message || errorObj}`);

	return sendError(
		res,
		errorHttp,
		`Error at ${name}: ${errorObj?.message || errorObj}`,
		errorHttp
	);
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
	try {
		const data = await modelFn(...reqObjs);
		return sendSuccess(res, { [dataKey]: data });
	} catch (error) {
		return catchMsg("callModel", error, res, dbErrorCode);
	}
}

export function assertSameUserOrThrow(requestedUserId, tokenUserId) {
	if (requestedUserId !== tokenUserId) {
		const err = new Error("User mismatch: unauthorized");
		err.statusCode = 403;
		throw err;
	}
}
