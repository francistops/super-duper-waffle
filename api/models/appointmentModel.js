import pool from "../db/pool.js";

//debug
export async function fetchAppointments() {
  const selectSql = `SELECT * FROM "Appointments"`;
  const queryResult = await pool.query(selectSql);
  return queryResult.rows;
};
export async function fetchAppointmentById(id) {
  return 'fetchAppointmentById niy'
};

export async function updateAppointmentStatus(id) {
  return 'updateAppointmentStatus niy'
};

export async function fetchNextAppointments(ids, nbRequested) {
  return "getNextAppointments niy"
};

export async function insertAppointments() {
  return 'insertAppointments niy'
};

export async function updateAppointments() {
  return 'updateAppointments niy'
};

export async function deleteAppointments() {
  return 'deleteAppointments niy'
};