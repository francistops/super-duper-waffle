import pool from "../db/pool.js";

export async function insertAvailability({
	hairdresser_id,
	availability_date,
}) {
	const { rows } = await pool.query(
		`INSERT INTO "availabilities" ("hairdresser_id", "availability_date") 
                      VALUES ($1, $2)
                      returning *;`,
		[hairdresser_id, availability_date]
	);
	return rows[0];
}

export async function updateAvailability({ id, status }) {
	const { rows } = await pool.query(
		`UPDATE "availabilities"
						SET "status" = $1
						WHERE "id" = $2
						RETURNING *`,
		[status, id]
	);
	return rows[0];
}

export async function fetchUserIdAvailabilities(id) {
	const { rows } = await pool.query(
		`SELECT
			availabilities.id AS availability_id,
			availabilities.status,
			availabilities.availability_date,
			availabilities.hairdresser_id,
			appointments.service_id,
			services.name AS service_name
		FROM availabilities
		JOIN appointments ON appointments.availability_id = availabilities.id
		JOIN users AS hairdresser ON appointments.hairdresser_id = hairdresser.id
		JOIN services ON appointments.service_id = services.id
		WHERE appointments.client_id = $1
		ORDER BY availabilities.availability_date ASC;
		`,
		[id]
	);
	return rows;
}

export async function isAvailabilityExist({
	availabilityId,
	hairdresser_id,
	availability_date,
}) {
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
		throw new Error(
			"At least one condition must be provided (availabilityId or hairdresser_id + availability_date)"
		);
	}

	query += conditions.join(" AND ") + " LIMIT 1";

	const queryResult = await pool.query(query, params);
	return queryResult.rows[0] || null;
}
