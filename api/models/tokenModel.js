import pool from "../db/pool.js";

export async function isTokenValid(token) {
	const { rows } = await pool.query(
		`SELECT "expires", "token", "user_id"
				FROM "tokens"
				WHERE "token" = $1::uuid;`,
				[token]
		);

		if (rows.length <= 0) throw new Error("array cannot be empty");
		
		console.log('istokenValid rows', rows);
	return rows;
}

export async function getActiveTokenByUserId(userId) {
	const { rows } = await pool.query(
		`SELECT "id"
				FROM "tokens"
				WHERE "user_id" = $1 AND "expires" > NOW()`,
		[userId]
	);
	return rows[0] || null;
}

export async function assignToken(userid) {

	const { check } = await pool.query(
		`SELECT "user_id"
				FROM "tokens"
				WHERE "user_id" = $1 AND "expires" > NOW()`,
		[userid]
	);
	

	const { rows } = await pool.query(
		`INSERT INTO "tokens" ("user_id", "token", "expires")
                	VALUES ($1, gen_random_uuid(), NOW() + INTERVAL '30 days')
                	RETURNING *;`,
		[userid]
	);
	return rows[0]?.token;
}



// `SELECT "expires", "token", "user_id"
// 				FROM "tokens"
// 				WHERE "token" LIKE $1::uuid
// 				AND "expires" >= NOW();`,