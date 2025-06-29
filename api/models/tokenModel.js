import pool from "../db/pool.js";

export async function isTokenValid(token) {
	//bypass for debug purpose
	return token
	
	const sql = `SELECT "expires", "token"
                FROM "tokens"
                WHERE "token" = $1
                AND "expires" >= NOW();`;
	const queryResult = await pool.query(sql, [token]);
	if (queryResult.rowCount != 1) {
		throw new Error("error 401: not a valid token");
	}

	return true;
}

export async function isTokenExist(id) {
	const sql = `SELECT "token" 
                	FROM "tokens"
                	WHERE "userid" = $1
                	AND "expires" > NOW();`;
	const queryResult = await pool.query(sql, [id]);
	if (queryResult.rowCount > 0) {
		return {
			status: true,
			token: queryResult.rows[0],
		};
	}
	return { status: false };
}
export async function assignToken(userid) {
	const sql = `INSERT INTO "tokens" ("userid", "token", "expires")
                	VALUES ($1, gen_random_uuid(), NOW() + INTERVAL '30 days')
                	RETURNING *;`;
	const queryResult = await pool.query(sql, [userid]);
	return queryResult.rows[0].token;
}

export async function fetchByToken(token) {
	const sql = `SELECT * 
                FROM "tokens"
                WHERE "token" = $1;`;
	const param = [token];
	const queryResult = await pool.query(sql, param);
	if (queryResult.rowCount != 1) {
		throw new Error(`Error 500: Too many tokens retrieve for token ${token}.`);
	}
	return queryResult.rows[0];
}
