import pool from "../db/pool.js";

export async function fetchServices() {
	const selectSql = `SELECT * 
							FROM "services"`;
	const queryResult = await pool.query(selectSql);
	return queryResult.rows;
}