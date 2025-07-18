import { assertSameUserOrThrow } from "../lib/utils.js";

/**
 * Crée un middleware de validation d'autorisation basé sur une fonction pour extraire le userId cible.
 * @param {(req: Request) => string | Promise<string>} getTargetUserId - fonction async ou sync qui retourne un userId à comparer à req.user.id
 */
export function authorizeBy(getTargetUserId) {
	return async function (req, res, next) {
		try {
			const targetUserId = await getTargetUserId(req);
			const tokenUserId = req.user.id;
			console.log(
				`authorizeBy: targetUserId=${targetUserId}, tokenUserId=${tokenUserId}`
			);
			assertSameUserOrThrow(targetUserId, tokenUserId);
			next();
		} catch (err) {
			res.status(403).formatView({
				message: err.message || "Unauthorized",
				errorCode: 403,
			});
		}
	};
}
