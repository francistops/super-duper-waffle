import pool from "../db/pool.js";

export async function fetchFeedbacks() {
	const selectSql = `SELECT *
  						FROM "feedbacks"
					`;
	const queryResult = await pool.query(selectSql);
	return queryResult.rows;
}

export async function insertFeedback() {
	return "insertFeedback niy";
}