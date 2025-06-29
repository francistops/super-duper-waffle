import pool from "../db/pool.js";
import { createHash } from "crypto";

const SALT = "monGrainDeCummin";

function hash(passHash) {
	return createHash("sha256")
		.update(SALT + passHash)
		.digest("hex");
}

export async function fetchUserById(id) {
	const sql = `SELECT "users"."email",
                      "users"."id",
                      "users"."passhash",
                      "users"."role",
                      "tokens"."token",
                      "tokens"."expires"
                FROM "users"
                LEFT JOIN "tokens" ON "users"."id" = "tokens"."userid"
                WHERE "users"."id" = $1;`;
	const result = await pool.query(sql, [id]);

	if (result.rowCount > 1) {
		throw new Error(`Too many users retrieve for id ${id}.`);
	} else if (result.rowCount < 1) {
		throw new Error(`User ${id} not found`);
	}
	return result.rows[0];
}

//todo make role optionnel
export async function insertUser(user) {
	const sql = `INSERT INTO users ("email", "passhash", "role") 
                      VALUES ($1, $2, $3)
                      returning *;`;
	const param = [user.email, hash(user.passhash), user.role];
	const result = await pool.query(sql, param);
	if (result.rowCount != 1) {
		throw new Error(`501: failed too many users: ${param}`);
	}
	return true;
}

export async function isUserValid(email, passhash) {
	const sql = `SELECT "email", "passhash" 
					FROM "users" 
					WHERE "email"=$1 
						AND "passhash"=$2;`;
	const result = await pool.query(sql, [email, hash(passhash)]);
	if (result.rowCount != 1) {
		throw new Error(`501: failed to identify user on db: ${param}`);
	}
	return true;
}

export async function fetchIdByEmail(email) {
	const selectSql = `SELECT "id", "email"
                      	FROM "users"
                      	WHERE email = $1`;
	const parameters = [email];
	const result = await pool.query(selectSql, parameters);
	if (result.rowCount === 0) {
		throw new Error(`504: User not found with email ${email}`);
	}
	if (result.rowCount > 1) {
		throw new Error(`Error 500: Too many users retrieve for email ${email}.`);
	}
	return result.rows[0].id;
}

export async function logoutByToken(token) {
	const sqlUpdatedToken = `UPDATE "tokens" 
                        		SET "expires" = NOW() 
                       		 	WHERE "token" = $1
                        		RETURNING *;`;

	const updateResult = await pool.query(sqlUpdatedToken, [token]);
	return updateResult.rowCount == 1 ? true : false;
}

export async function fetchByRole(role) {
	const query = `SELECT * FROM "users" WHERE "role" = $1`;
	const result = await pool.query(query, [role]);
	return result.rows;
}
//todo check if user and token match
//todo cannot delete due to db structure
export async function deleteUser(id) {
	const sql = `DELETE FROM "users"
						WHERE "id" = $1`;
	const result = await pool.query(sql, [id]);
	return result.rowCount == 1 ? true : false;
}
