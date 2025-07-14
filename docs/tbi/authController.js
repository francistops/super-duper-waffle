import { issueToken, revokeToken, hasNoToken } from '../models/tokenModel.js';
import { createUser, fetchUserByCredentials } from '../models/userModel.js';
import { makeError, makeSuccess } from '../utils/resultFactory.js';

export async function subscribe(req, res) {
    let result = makeError();

    const data = req.body;

    if (!data.user || !data.user.email || !data.user.passHash) {
        res.status(400);
        result = makeError(`Missing fields`, 5001);
    } else {
        try {
            await createUser(data.user);
            result = makeSuccess({subscribed: true});
        } catch (error) {
            res.status(400);
            result = makeError(`Error subscribing - ${error}`, 5002);
        }
    }

    res.formatView(result);
}

export async function login(req, res) {
    let result = makeError();

    const data = req.body;

    if (!data.user || !data.user.email || !data.user.passHash) {
        res.status(400);
        result = makeError(`Missing fields`, 5011);
    } else {
        try {
            let user = await fetchUserByCredentials(data.user.email, data.user.passHash);
            
            if (!await hasNoToken(user)) {
                throw new Error('Token already exists...');
            }

            const token = await issueToken(user);
            user.token = token.token;
            result = makeSuccess({user: user});
        } catch (error) {
            res.status(400);
            result = makeError(`Error loging in: ${error}`, 5012);
        }
    }

    res.formatView(result);
}

export async function logout(req, res) {
    let result = makeError();

    const data = req.body;

    try {
        const token = req.selectedToken;
        const isRevoked = await revokeToken(token.token);

        result = makeSuccess({revoked: isRevoked});
    } catch (error) {
        res.status(400);
        result = makeError(`Error loging out: ${error}`, 5022);
    }

    res.formatView(result);
}
