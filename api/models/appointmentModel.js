import pool from "../db/pool.js";

export async function fetchAppointments() {
	const selectSql = `SELECT *
  					FROM "appointments"`;
	const queryResult = await pool.query(selectSql);
	return queryResult.rows;
}

export async function fetchUserIdAppointments(id) {
	const selectSql = `SELECT *
  					FROM "appointments"
					WHERE "client_id" = $1
					OR "hairdresser_id" = $1`;
	const queryResult = await pool.query(selectSql, [id]);
	return queryResult.rows;
}

export async function updateAppointment(id, status) {
	const updateSql = `UPDATE "appointments"
					SET "status" = $1
					WHERE "id" = $2
					RETURNING *`;
	const queryResult = await pool.query(updateSql, [status, id]);
	return queryResult.rows[0];
}

export async function insertAppointment(appointment) {
	const insertSql = `INSERT INTO "appointments" ("client_id","hairdresser_id","service_id", "availability_id") 
                      VALUES ($1, $2, $3, $4)
                      returning *;`;
	const param = [
		appointment.client_id,
		appointment.hairdresser_id,
		appointment.service_id,
		appointment.availability_id
	];
	const queryResult = await pool.query(insertSql, param);
	return queryResult.rows[0];
}

export async function isAppointmentExist(client_id, hairdresser_id, availability_id) {
	const selectSql = `SELECT 1 FROM "appointments"
	                  WHERE "client_id" = $1 AND "hairdresser_id" = $2 AND "availability_id" = $3
	                  LIMIT 1;`;
	const queryResult = await pool.query(selectSql, [client_id, hairdresser_id, availability_id]);
	return queryResult.rowCount === 1;
}