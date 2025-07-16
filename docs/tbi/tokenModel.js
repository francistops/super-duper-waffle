import { pool } from "../db/pool.js";

export async function hasNoToken(user) {
	const { rowCount } = await pool.query(
		`
        SELECT "tokens"."token", 
                "tokens"."created", 
                "tokens"."expires"
            FROM "tokens" 
            WHERE "tokens"."userId" = $1 
                AND "tokens"."expires" > NOW()
        `,
		[user.id]
	);

	return rowCount == 0;
}

export async function isTokenValid(token) {
	const { rows, rowCount } = await pool.query(
		`
        SELECT "tokens"."token", 
                "tokens"."created", 
                "tokens"."expires"
            FROM "tokens"
            WHERE "tokens"."token" = $1
                AND "tokens"."expires" > NOW()
        `,
		[token]
	);
	if (rowCount != 1) {
		throw new Error(`Should have received only one token, got ${rowCount}.`);
	}
	return rows[0];
}

export async function issueToken(user) {
	const {
		rows: [row],
	} = await pool.query(
		`
            INSERT INTO "tokens" ("userId")
                VALUES ($1)
                RETURNING *
        `,
		[user.id]
	);
	return row;
}

export async function revokeToken(token) {
	await pool.query(
		`
        DELETE 
            FROM "tokens" 
            WHERE "tokens"."token" = $1
        `,
		[token]
	);
	return true;
}
