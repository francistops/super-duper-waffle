import pool from "../db/pool.js";

//debug
export async function fetchServices() {
  const selectSql = `SELECT * FROM "services"`;
  const queryResult = await pool.query(selectSql);
  return queryResult.rows;
};
export async function fetchServicesById(id) {
  return 'fetchServicesById niy'
};

export async function fetchServicesByAppointmentId(id) {
  return 'fetchServicesByAppointmentId niy'
};

export async function fetchServicesByHairdresserId(id) {
  return 'fetchServicesByHairdresserId niy'
};

export async function fetchNextServices(ids, nbRequested) {
  return "fetchNextServices niy"
};

export async function insertService() {
  return 'insertService niy'
};

export async function updateService() {
  return 'updateService niy'
};

export async function deleteService() {
  return 'deleteService niy'
};