import pool from "../db/pool.js";
import { createHash } from "crypto";

const SALT = "monGrainDeCummin";

export function hash(passHash) {
	return createHash("sha256")
		.update(SALT + passHash)
		.digest("hex");
}

export async function fetchUserById(id) {
	const { rows } = await pool.query(
		`SELECT "id",
                      "email",
                      "role"
						FROM "users"
						WHERE "users"."id" = $1;`,
		[id]
	);
	return rows[0];
}

export async function insertUser(user) {;
	const role = user.role || "client";

	await pool.query(
		`INSERT INTO users ("email", "passhash", "role", "first_name", "last_name")
		 VALUES ($1, $2, $3, $4, $5)`,
		[user.email, hash(user.passhash), role, user.first_name, user.last_name]
	);

	return true;
}

export async function isUserExist(email, passhash) {
	const { rows } = await pool.query(
		`SELECT "id", "email", "role"
		FROM "users"
		WHERE "email" = $1 AND "passhash"= $2;`,
		[email, hash(passhash)]
	);
	return rows[0] || null;
}

export async function fetchIdByEmail(email) {
	const { rows } = await pool.query(
		`SELECT "id"
		FROM "users"
		WHERE "email" = $1`,
		[email]
	);
	return rows[0].id;
}

export async function logoutByToken(token) {
	const { rows } = await pool.query(
		`UPDATE "tokens" 
						SET "expires" = NOW() 
						WHERE "token" = $1
						RETURNING *;`,
		[token]
	);
	return rows.length === 1;
}

export async function fetchByRole(role) {
	const { rows } = await pool.query(
		`SELECT "id", "email" FROM "users" WHERE "role" = $1`,
		[role]
	);
	return rows;
}

export async function deactivateUserById(id) {
	const newEmail = `${id}@deactivated.local`;
	const { rowCount } = await pool.query(
		`UPDATE "users"
			SET "email" = $1, "passhash" = $2, "role" = 'deactivated'
			WHERE "id" = $3`,
		[newEmail, hash(id), id]
	);
	return rowCount === 1;
}
