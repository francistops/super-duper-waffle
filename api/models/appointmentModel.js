import pool from "../db/pool.js";

// CREATE TABLE "appointments" (
//     "id" uuid DEFAULT gen_random_uuid(),
//     "client_id" uuid NOT NULL REFERENCES "users"("id"),
//     "hairdresser_id" uuid NOT NULL REFERENCES "users"("id"),
//     "service_id" uuid NOT NULL REFERENCES "services"("id"),
//     "date" TIMESTAMP NOT NULL,
//     "status" VARCHAR(20) DEFAULT 'pending',
//     PRIMARY KEY ("id")
// );

export async function fetchAppointments() {
	const sql = `SELECT *
  					FROM "appointments"
					WHERE "status" = 'confirmed'`;
	const result = await pool.query(sql);
	return result.rows;
}

export async function fetchAppointmentById(id) {
	const sql = `SELECT *
  					FROM "appointments"
					WHERE "client_id" = $1
					OR "hairdresser_id" = $1`;
	const result = await pool.query(sql, [id]);
	return result.rows[0];
}

export async function updateAppointmentStatus(id) {
	const sql = `UPDATE "appointments"
					SET "status" = 'confirmed'
					WHERE "id" = $1
					RETURNING *`;
	const result = await pool.query(sql, [id]);
	if (result.rowCount === 0) {
		throw new Error(`Appointment with id ${id} not found`);
	}
	return true;
}

export async function fetchNextAppointments(ids, nbRequested) {
	return "getNextAppointments niy";
}

export async function insertAppointment(appointment) {
	const sql = `INSERT INTO "appointments ("client_id", "hairdresser_id", "service_id") 
                      VALUES ($1, $2, $3, $4)
                      returning *;`;
	const param = [
		appointment.clientId,
		appointment.hairdresserId,
		appointment.serviceId
	];
	const result = await pool.query(sql, param);
	if (result.rowCount != 1) {
		throw new Error(`501: failed too many appointments: ${param}`);
	}
	return true;
}

export async function updateAppointment(id) {
	const sql = `UPDATE "appointments" 
                    SET "status" = 'confirmed' 
                    WHERE "id" = $1
                    RETURNING *;`;
	const result = await pool.query(sql, [id]);
	return result.rowCount == 1 ? true : false;
}

export async function deleteAppointment(id) {
	const sql = `DELETE FROM "appointments"
						WHERE "id" = $1`;
	const result = await pool.query(sql, [id]);
	return result.rowCount == 1 ? true : false;
}
