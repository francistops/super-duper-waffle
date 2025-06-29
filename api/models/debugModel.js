import pool from "../db/pool.js";

export async function fetchUsers() {
	const sql = `SELECT "users"."email",
                      "users"."id",
                      "users"."passhash",
                      "users"."role",
                      "tokens"."token",
                      "tokens"."expires"
                FROM "users"
                LEFT JOIN "tokens" ON "users"."id" = "tokens"."userid"
                ORDER BY "users"."email";`;
	const queryResult = await pool.query(sql);
	return queryResult.rows;
}

export async function fetchTokens() {
	const sql = `SELECT * FROM "tokens"`;
	const queryResult = await pool.query(sql);
	return queryResult.rows;
}
