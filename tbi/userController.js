import { fetchAllUsers, fetchUserById } from '../models/userModel.js';
import { makeError, makeSuccess } from '../utils/resultFactory.js';


export async function getUserById(req, res) {
    let result = makeError();

    const { id } = req.params;

    try {
        const user = await fetchUserById(id);
        result = makeSuccess({user: user});
    } catch (error) {
        res.status(400);
        result = makeError(`Error retrieving user with id ${id}`, 1001);
    }

    res.formatView(result);
}
