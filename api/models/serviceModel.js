import pool from "../db/pool.js";

export async function fetchServices() {
	const selectSql = `SELECT * FROM "services"`;
	const queryResult = await pool.query(selectSql);
	return queryResult.rows;
}

export async function fetchServiceById(id) {
	return "fetchServicesById niy";
}

export async function fetchServiceByAppointmentId(id) {
	return "fetchServicesByAppointmentId niy";
}

export async function insertService() {
	return "insertService niy";
}

export async function updateService() {
	return "updateService niy";
}

export async function deleteService() {
	return "deleteService niy";
}
