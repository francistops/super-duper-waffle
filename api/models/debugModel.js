import pool from "../db/pool.js";

export async function fetchUsers() {
	const { rows } = await pool.query(`
            SELECT "users"."email",
                      "users"."id",
                      "users"."passhash",
                      "users"."role",
                      "tokens"."token",
                      "tokens"."expires"
                FROM "users"
                LEFT JOIN "tokens" ON "users"."id" = "tokens"."user_id"
                ORDER BY "users"."email";
            `);
	return rows;
}

export async function fetchTokens() {
	const { rows } = await pool.query(`SELECT * FROM "tokens"`);
	return rows;
}

export async function fetchAvailabilities() {
	const { rows } = await pool.query(`SELECT * FROM "availabilities"`);
	return rows;
}

export async function fetchAppointments() {
	const { rows } = await pool.query(`SELECT * FROM "appointments"`);
	return rows;
}

export async function fetchUserById(id) {
	const { rows, rowCount } = await pool.query(
		`
            SELECT "users"."email",
                      "users"."id",
                      "users"."passhash",
                      "users"."role",
                      "tokens"."token",
                      "tokens"."expires"
                FROM "users"
                LEFT JOIN "tokens" ON "users"."id" = "tokens"."user_id"
                WHERE "users"."id" = $1;
                `,
		[id]
	);
	if (rowCount > 1) throw new Error(`Too many users for id ${id}`);
	else if (result.rowCount < 1) throw new Error(`User ${id} not found`);
	return rows[0];
}
