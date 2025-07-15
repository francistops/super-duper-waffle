import pool from "../db/pool.js";

export async function fetchUsers() {
	const selectSql = `SELECT "users"."email",
                      "users"."id",
                      "users"."passhash",
                      "users"."role",
                      "tokens"."token",
                      "tokens"."expires"
                FROM "users"
                LEFT JOIN "tokens" ON "users"."id" = "tokens"."user_id"
                ORDER BY "users"."email";`;
	const queryResult = await pool.query(selectSql);
	return queryResult.rows;
}

export async function fetchTokens() {
	const selectSql = `SELECT * FROM "tokens"`;
	const queryResult = await pool.query(selectSql);
	return queryResult.rows;
}

export async function fetchAvailabilities() {
	const selectSql = `SELECT * FROM "availabilities"`;
	const queryResult = await pool.query(selectSql);
	return queryResult.rows;
}

export async function fetchAppointments() {
	const selectSql = `SELECT *
  					FROM "appointments"`;
	const queryResult = await pool.query(selectSql);
	return queryResult.rows;
}