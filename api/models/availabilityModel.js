import pool from "../db/pool.js";

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

export async function isAvailabilityExist({ availabilityId, hairdresser_id, availability_date }) {
	let query = `SELECT * FROM "availabilities" WHERE `;
	const params = [];
	const conditions = [];

	if (availabilityId) {
		conditions.push(`"id" = $${params.length + 1}`);
		params.push(availabilityId);
	}

	if (hairdresser_id && availability_date) {
		conditions.push(`"hairdresser_id" = $${params.length + 1}`);
		params.push(hairdresser_id);

		conditions.push(`"availability_date" = $${params.length + 1}`);
		params.push(availability_date);
	}

	if (conditions.length === 0) {
		throw new Error("At least one condition must be provided (availabilityId or hairdresser_id + availability_date)");
	}

	query += conditions.join(" AND ") + " LIMIT 1";

	const queryResult = await pool.query(query, params);
	return queryResult.rows[0] || null;
}
