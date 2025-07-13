import pool from "../db/pool.js";

export async function isTokenValid(token) {

	const sql = `SELECT "expires", "token", "user_id"
                FROM "tokens"
                WHERE "token" = $1
                AND "expires" >= NOW();`;
	const result = await pool.query(sql, [token]);
	if (result.rowCount != 1) {
		throw new Error("error 401: not a valid token");
	}

	return result.rows[0];
}

export async function isTokenExist(id) {
	const sql = `SELECT "token" 
                	FROM "tokens"
                	WHERE "user_id" = $1
                	AND "expires" > NOW();`;
	const result = await pool.query(sql, [id]);
	if (result.rowCount > 0) {
		return {
			status: true,
			token: result.rows[0],
		};
	}
	return { status: false };
}

export async function assignToken(userid) {
	const sql = `INSERT INTO "tokens" ("user_id", "token", "expires")
                	VALUES ($1, gen_random_uuid(), NOW() + INTERVAL '30 days')
                	RETURNING *;`;
	const result = await pool.query(sql, [userid]);
	return result.rows[0].token;
}

export async function fetchByToken(token) {
	const sql = `SELECT * 
                FROM "tokens"
                WHERE "token" = $1;`;
	const result = await pool.query(sql, [token]);
	if (result.rowCount != 1) {
		throw new Error(`Error 500: Too many tokens retrieve for token ${token}.`);
	}
	return result.rows[0];
}
