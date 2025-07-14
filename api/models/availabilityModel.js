import pool from "../db/pool.js";

export async function fetchAvailabilities() {
	const selectSql = `SELECT * FROM "availabilities"`;
	const queryResult = await pool.query(selectSql);
	return queryResult.rows;
}

export async function insertAvailability({ hairdresser_id, availability_date }) {
	
	const insertSql = `INSERT INTO "availabilities" ("hairdresser_id", "availability_date") 
                      VALUES ($1, $2)
                      returning *;`;
	const param = [
		hairdresser_id,
		availability_date
	];

	const queryResult = await pool.query(insertSql, param);
	return queryResult.rows[0];
}

export async function updateAvailability({id, status}) {
	const updateSql = `UPDATE "availabilities"
						SET "status" = $1
						WHERE "id" = $2
						RETURNING *`;

	const queryResult = await pool.query(updateSql, [status, id]);
	return queryResult.rows[0];
}

export async function fetchUserIdAvailabilities(id) {
	const selectSql = `SELECT *
						FROM "availabilities"
						WHERE "hairdresser_id" = $1`;
	const queryResult = await pool.query(selectSql, [id]);
	return queryResult.rows;
}

export async function isAvailabilityExist(hairdresser_id, availability_date) {
	const selectSql = `SELECT 1 FROM "availabilities"
	                  WHERE "hairdresser_id" = $1 AND "availability_date" = $2
	                  LIMIT 1;`;
	const queryResult = await pool.query(selectSql, [hairdresser_id, availability_date]);
	return queryResult.rowCount === 1;
}