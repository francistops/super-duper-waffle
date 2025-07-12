import pool from "../db/pool.js";

export async function fetchAvailabilities() {
	const selectSql = `SELECT * FROM "availabilities"`;
	const queryResult = await pool.query(selectSql);
	return queryResult.rows;
}

export async function insertAvailability({ hairdresser_id, availability_date }) {
	const sql = `INSERT INTO "availabilities" ("hairdresser_id", "availability_date") 
                      VALUES ($1, $2)
                      returning *;`;
	const param = [
		hairdresser_id,
		availability_date
	];

	const result = await pool.query(sql, param);

	if (result.rowCount !== 1) {
		throw new Error(`501: failed too many availabilities: ${param}`);
	}
	return result.rows[0];
}

export async function updateAvailability({id, status}) {
	const sql = `UPDATE "availabilities"
					SET "status" = $1
					WHERE "id" = $2
					RETURNING *`;

	const result = await pool.query(sql, [status, id]);

	if (result.rowCount === 0) {
		throw new Error(`Availability with id ${id} not found`);
	}
	return result.rows[0];
}
