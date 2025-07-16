import { pool } from "../db/pool.js";
import { createHash } from "crypto";

const SALT = "monGrainDeSel";

function hash(passHash) {
	return createHash("sha256")
		.update(SALT + passHash)
		.digest("hex");
}

export async function fetchAllUsers() {
	const { rows } = await pool.query(`
        SELECT "users"."id", 
                "users"."email", 
                "users"."firstName", 
                "users"."lastName"
            FROM "users" 
            ORDER BY "email"
        `);
	return rows;
}

export async function fetchUserById(id) {
	const { rows, rowCount } = await pool.query(
		`
        SELECT "users"."id", 
                    "users"."email", 
                    "users"."firstName", 
                    "users"."lastName" 
            FROM "users" 
            WHERE id = $1
        `,
		[id]
	);
	if (rowCount > 1) throw new Error(`Too many users for id ${id}`);
	return rows[0];
}

export async function fetchUserByCredentials(email, passHash) {
	const { rows } = await pool.query(
		`
        SELECT "users"."id", 
                "users"."email", 
                "users"."firstName", 
                "users"."lastName"
            FROM "users"
            WHERE "users"."email" = $1 
                AND "users"."passHash" = $2;
        `,
		[email, hash(passHash)]
	);
	return rows[0];
}

export async function createUser(user) {
	const { email, firstName, lastName, passHash } = user;

	const { rows } = await pool.query(
		`
        INSERT INTO "users" ("email", "firstName", "lastName", "passHash")
        VALUES ($1,$2,$3,$4)
        RETURNING *
        `,
		[email, firstName, lastName, hash(passHash)]
	);
	return rows[0];
}
