
import { isTokenValid, isTokenExist } from '../models/tokenModel.js';
import { catchMsg } from '../lib/utils.js';
import { fetchUserById } from '../models/userModel.js';

const UNKNOWN_ERROR = {
	message: "Unknown error",
	errorCode: 9999,
};

export async function validateToken(req, res, next) {
	const header = req.headers.authorization || '';
	const [scheme, token] = header.split(' ');
	if (scheme !== 'Bearer' || !token) {
		return res
			.status(400)
			.formatView({ message: 'Missing or malformed token', errorCode: 400 });
	}

	try {
		const tokenRow = await isTokenValid(token);

		if (!tokenRow) {
			return res
			.status(401)
			.formatView({ message: 'Invalid or expired token', errorCode: 401 });
		}

		// this is to check if the token given is actually the user's token?
		const isTokenResult = await isTokenExist(tokenRow.user_id);
		if (!isTokenResult.status) {
			return res
				.status(403)
				.formatView({ message: 'No active session found', errorCode: 403 });
		}

		if (isTokenResult.token.token !== token) {
			return res
				.status(403)
				.formatView({ message: 'Token mismatch: unauthorized', errorCode: 403 });
		}

		const user = await fetchUserById(tokenRow.user_id);
		if (!user) {
			return res
				.status(404)
				.formatView({ message: 'User not found', errorCode: 404 });
		}

		req.selectedToken = tokenRow;
<<<<<<< HEAD
		req.user = { id: tokenRow.user_id }; 
		// why is the return remove here?
		// i'm extra careful in middleware
		// has it effect a lot of route if it break
		// or even changed
=======
		req.user = user;

>>>>>>> 28127b2 (Sorry j'étais sur le main, check dans readme pour voir ce qui fonctionne, je viens de penser que dans appointment controller il faut que je gère que c'est un token de client qui peut add ou modify un appointment, je ne l'ai pas fais encore)
		next();
	} catch (err) {
		const result = { ...UNKNOWN_ERROR };
		catchMsg("authGuard validateToken", err, res, result, 500);
		res.formatView(result);
	}
}