import pool from "../db/pool.js";

export async function isTokenValid(token) {

	const selectSql = `SELECT "expires", "token", "user_id"
                FROM "tokens"
                WHERE "token" = $1
                AND "expires" >= NOW();`;
	const queryResult = await pool.query(selectSql, [token]);
	if (queryResult.rowCount != 1) {
		return null;
	}
	return queryResult.rows[0];
}

export async function isTokenExist(id) {
	const selectSql = `SELECT "token" 
                	FROM "tokens"
                	WHERE "user_id" = $1
                	AND "expires" > NOW();`;
	const queryResult = await pool.query(selectSql, [id]);
	if (queryResult.rowCount > 0) {
		return {
			status: true,
			token: queryResult.rows[0],
		};
	}
	return { status: false };
}

export async function assignToken(userid) {
	const selectSql = `INSERT INTO "tokens" ("user_id", "token", "expires")
                	VALUES ($1, gen_random_uuid(), NOW() + INTERVAL '30 days')
                	RETURNING *;`;
	const queryResult = await pool.query(selectSql, [userid]);
	return queryResult.rows[0].token;
}
