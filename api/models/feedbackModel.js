import pool from "../db/pool.js";

export async function fetchFeedbacks() {
	const selectSql = `SELECT *
  						FROM "feedbacks"
					`;
	const queryResult = await pool.query(selectSql);
	return queryResult.rows;
}

export async function insertFeedback(feedback) {
	const insertSql = `INSERT INTO "feedbacks" ("appointment_id","client_id", "comment", "rating") 
						VALUES ($1, $2, $3, $4)
						returning *;`;
	const params = [
		feedback.appointmentId,
		feedback.clientId,
		feedback.comment,
		feedback.rating
	];
	const queryResult = await pool.query(insertSql, params);
	return queryResult.rows[0];
}

export async function isFeedbackExist(appointment_id, client_id) {
	const selectSql = `SELECT 1 FROM "feedbacks"
	                  WHERE "appointment_id" = $1 AND "client_id" = $2
	                  LIMIT 1;`;
	const queryResult = await pool.query(selectSql, [appointment_id, client_id]);
	return queryResult.rowCount === 1;
}