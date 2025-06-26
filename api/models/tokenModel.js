import pool from "../db/pool.js";

export async function isTokenValid(token) {
	const sql = `SELECT "expires", "token"
                FROM "tokens"
                WHERE "token" = $1
                AND "expires" >= NOW();`;
	const queryResult = await pool.query(sql, [token]);
	if (queryResult.rowCount != 1) {
		throw new Error("error 401: not a valid token");
	}

	// console.log('in isTokenValid model', queryResult.rows[0].tokenUuid);
	return queryResult.rows[0].tokenUuid;
}

export async function isTokenExist(userid) {
	const sql = `SELECT * 
                FROM "tokens"
                WHERE "userid" = $1
                AND "expires" > NOW();`;
	const queryResult = await pool.query(sql, [userid]);
	console.log("isTokenExist queryResult: ", queryResult.rows);
	if (queryResult.rowCount > 0) {
		return {
			status: true,
			token: queryResult.rows[0].token,
			expires: queryResult.rows[0].expires,
		};
	}
	return { status: false };
}
export async function assignToken(userid) {
	console.log("--- in assignToken model ---");
	console.log("userid: ", userid);
	const sql = `INSERT INTO "tokens" ("userid", "token", "expires")
                VALUES ($1, gen_random_uuid(), NOW() + INTERVAL '30 days')
                RETURNING *;`;
	const queryResult = await pool.query(sql, [userid]);
	// console.log("assigntoken queryResult: ", queryResult.rows);
	return queryResult.rows[0];
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
