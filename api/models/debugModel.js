import pool from "../db/pool.js";

export async function fetchUsers() {
	const sql = `SELECT "users"."email",
                      "users"."id",
                      "users"."passhash",
                      "users"."role",
                      "tokens"."token",
                      "tokens"."expires"
                FROM "users"
                LEFT JOIN "tokens" ON "users"."id" = "tokens"."user_id"
                ORDER BY "users"."email";`;
	const queryResult = await pool.query(sql);
	return queryResult.rows;
}

export async function fetchTokens() {
	const sql = `SELECT * FROM "tokens"`;
	const queryResult = await pool.query(sql);
	return queryResult.rows;
}

export async function fetchUserById(id) {
      const sql = `SELECT "users"."email",
                      "users"."id",
                      "users"."passhash",
                      "users"."role",
                      "tokens"."token",
                      "tokens"."expires"
                FROM "users"
                LEFT JOIN "tokens" ON "users"."id" = "tokens"."user_id"
                WHERE "users"."id" = $1;`;
      const result = await pool.query(sql, [id]);

      if (result.rowCount > 1) {
            throw new Error(`Too many users retrieve for id ${id}.`);
      } else if (result.rowCount < 1) {
            throw new Error(`User ${id} not found`);
      }
      return result.rows[0];
}
