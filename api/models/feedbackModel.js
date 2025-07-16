import pool from "../db/pool.js";

export async function fetchFeedbacks() {
	const { rows } = await pool.query(`SELECT *
  						FROM "feedbacks"
					`);
	return rows;
}

export async function insertFeedback(feedback) {
	const { rows } = await pool.query(`INSERT INTO "feedbacks" ("appointment_id","client_id", "comment", "rating") 
						VALUES ($1, $2, $3, $4)
						returning *;`, 
	[
		feedback.appointmentId,
		feedback.clientId,
		feedback.comment,
		feedback.rating
	]);
	return rows[0];
}

export async function isFeedbackExist(appointment_id, client_id) {
	const { rows } = await pool.query(`SELECT 1 FROM "feedbacks"
	                  WHERE "appointment_id" = $1 AND "client_id" = $2
	                  LIMIT 1;`, [appointment_id, client_id]);
	return rows.length === 1;
}