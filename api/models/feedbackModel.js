import pool from "../db/pool.js";

// CREATE TABLE "feedback" (
//     "id" uuid DEFAULT gen_random_uuid(),
//     "hairdresser_id" uuid NOT NULL REFERENCES "users"("id"),
//     "client_id" uuid NOT NULL REFERENCES "users"("id"),
//     "rating" INTEGER CHECK ("rating" BETWEEN 1 AND 5) NOT NULL,
//     "comment" TEXT,
//     PRIMARY KEY ("id")
// ); 

export async function fetchFeedback() {
	const sql = `SELECT *
  					FROM "feedbacks"
					ORDER BY "rating" DESC;`;
	const result = await pool.query(sql);
	return result.rows;
};

export async function fetchFeedbackByAppointmentId(id) {
  return 'fetchServicesByAppointmentId niy'
};

export async function fetchFeedbackByHairdresserId(id) {
  return 'fetchServicesByHairdresserId niy'
};

export async function fetchNextFeedback(ids, nbRequested) {
  return "fetchNextFeedback niy"
};

export async function insertFeedback() {
  return 'insertFeedback niy'
};

export async function updateFeedback() {
  return 'updateFeedback niy'
};

export async function deleteFeedback() {
  return 'deleteFeedback niy'
};