import pool from "../db/pool.js";

export async function fetchUserIdAppointments(id) {
	const { rows } = await pool.query(
		`SELECT
						appointments.id,
						appointments.status,
						appointments.availability_id,
						availabilities.availability_date,
						appointments.hairdresser_id,
						appointments.service_id,
						services.name AS service_name
						FROM appointments
						JOIN availabilities ON appointments.availability_id = availabilities.id
						JOIN users AS hairdresser ON appointments.hairdresser_id = hairdresser.id
						JOIN services ON appointments.service_id = services.id
						WHERE appointments.client_id = $1
						ORDER BY availabilities.availability_date ASC;
						`,
		[id]
	);
	return rows;
}

export async function updateAppointment(id, status) {
	const { rows } = await pool.query(
		`UPDATE "appointments"
					SET "status" = $1
					WHERE "id" = $2
					RETURNING *`,
		[status, id]
	);
	return rows[0];
}

export async function insertAppointment(appointment) {
	const { rows } = await pool.query(
		`INSERT INTO "appointments" ("client_id","service_id", "availability_id") 
                      VALUES ($1, $2, $3)
                      returning *;`,
		[appointment.client_id, appointment.service_id, appointment.availability_id]
	);
	return rows[0];
}

export async function isAppointmentExist(
	client_id,
	hairdresser_id,
	availability_id
) {
	const { rows } = await pool.query(
		`SELECT 1 FROM "appointments"
	                  WHERE "client_id" = $1 AND "hairdresser_id" = $2 AND "availability_id" = $3
	                  LIMIT 1;`,
		[client_id, hairdresser_id, availability_id]
	);
	return rows.length === 1;
}
