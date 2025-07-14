import pool from "../db/pool.js";
import { createHash } from "crypto";

const SALT = "monGrainDeCummin";

function hash(passHash) {
	return createHash("sha256")
		.update(SALT + passHash)
		.digest("hex");
}

export async function fetchAllUsers() {
	const selectSql = `SELECT * FROM "users";`;
	const queryResult = await pool.query(selectSql);
	return queryResult.rows;
}

export async function fetchUserById(id) {
	const selectSql = `SELECT "id",
                      "email",
                      "role"
						FROM "users"
						WHERE "users"."id" = $1;`;
	const queryResult = await pool.query(selectSql, [id]);
	return queryResult.rows[0];
}

export async function insertUser(user) {
	const role = user.role || "client";
	const selectSql = `INSERT INTO users ("email", "passhash", "role") 
						VALUES ($1, $2, $3)
						returning *;`;
	const param = [
		user.email, 
		hash(user.passhash), 
		role
	];
	const queryResult = await pool.query(selectSql, param);
	return queryResult.rows[0];
}

export async function isUserValid(email, passhash) {
	const selectSql = `SELECT "email"
	                   FROM "users"
	                   WHERE "email" = $1 AND "passhash"= $2;`;

	const queryResult = await pool.query(selectSql, [email, hash(passhash)]);
	return queryResult.rowCount === 1;
}

export async function fetchIdByEmail(email) {
	const selectSql = `SELECT "id"
                      	FROM "users"
                      	WHERE "email" = $1`;
	const queryResult = await pool.query(selectSql, [email]);
	if (queryResult.rowCount === 0) return null;
	return queryResult.rows[0].id;
}

export async function logoutByToken(token) {
	const updateSql = `UPDATE "tokens" 
						SET "expires" = NOW() 
						WHERE "token" = $1
						RETURNING *;
				`;
	const queryResult = await pool.query(updateSql, [token]);
	return queryResult.rowCount == 1 ? true : false;
}

export async function fetchByRole(role) {
	const selectSql = `SELECT * FROM "users" WHERE "role" = $1`;
	const queryResult = await pool.query(selectSql, [role]);
	return queryResult.rows;
}

export async function deactivateUserById(id) {
	const newEmail  = `${id}@deactivated.local`;
	const updateSql = `	UPDATE "users"
							SET "email" = $1, "passhash" = 'deactivated', "role" = 'deactivated'
							WHERE "id" = $2
						`;
	const queryResult = await pool.query(updateSql, [newEmail, id]);
	return queryResult.rowCount === 1;
}
