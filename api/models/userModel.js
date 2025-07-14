import pool from "../db/pool.js";
import { createHash } from "crypto";

const SALT = "monGrainDeCummin";

function hash(passHash) {
	return createHash("sha256")
		.update(SALT + passHash)
		.digest("hex");
}

// removing fetchAllUsers() because it's already in debug and
// the other one is better has it also show token per user
// if user has one

// fetchUserById(id) was deem not needed by the frontend
// also has a similar one in debugModel

// let me know if either are require by the frontend or other

// also wondering why sql and result were rename?
// no biggie, I will use queryResult "Verb"Sql in the future


// leaving it here for now has a route require it	
export async function fetchUserById(id) {
	const selectSql = `SELECT "id",
                      "email",
                      "role"
						FROM "users"
						WHERE "users"."id" = $1;`;
	const queryResult = await pool.query(selectSql, [id]);
	//re-adding the trow let me know if i shouldn't have
	if (queryResult.rowCount < 1) throw new Error(`User ${id} not found`);
	
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
	//why do we need to return the user
	// checked and we dont, let me know if we do
	// change the check but need testing
	return queryResult.rowCount === 1;
}

// good catch, i was bit too open here 
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
	if (queryResult.rowCount === 0) throw new Error(`${email} not found`);
	return queryResult.rows[0].id;
}

export async function logoutByToken(token) {
	const updateSql = `UPDATE "tokens" 
						SET "expires" = NOW() 
						WHERE "token" = $1
						RETURNING *;
				`;
	const queryResult = await pool.query(updateSql, [token]);
	return queryResult.rowCount === 1;
}

export async function fetchByRole(role) {
	const selectSql = `SELECT * FROM "users" WHERE "role" = $1`;
	const queryResult = await pool.query(selectSql, [role]);
	return queryResult.rows;
}

export async function deactivateUserById(id) {
	const newEmail  = `${id}@deactivated.local`;
	const updateSql = `	UPDATE "users"
							SET "email" = $1, "passhash" = $3, "role" = 'deactivated'
							WHERE "id" = $2
						`;
	const queryResult = await pool.query(updateSql, [newEmail, id, hash(id)]);
	return queryResult.rowCount === 1;
}
