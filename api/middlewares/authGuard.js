import { catchMsg } from "../lib/utils.js";
import { fetchUserById } from "../models/userModel.js";
import { isTokenValid } from "../models/tokenModel.js";
import { makeError } from "../utils/resultFactory.js";

export async function validateToken(req, res, next) {
	let result = makeError();

	const header = req.headers.authorization || "";
	const [scheme, token] = header.split(" ");

	if (scheme !== "Bearer" || !token) {
		result = makeError("Missing or malformed token", 400);
		return res.status(400).formatView(result);
	}

	try {
		const tokenRow = await isTokenValid(token);

		if (!tokenRow) {
			result = makeError("Invalid or expired token", 401);
			return res.status(401).formatView(result);
		}
		
		const user = await fetchUserById(tokenRow.user_id);
		console.log(user);
		if (!user) {
			result = makeError("User not found", 404);
			return res.status(404).formatView(result);
		}

		req.selectedToken = tokenRow;
		req.user = user;
		next();
	} catch (err) {
		catchMsg("authGuard validateToken", err, res, result, 500);
		return res.formatView(result);
	}
}
