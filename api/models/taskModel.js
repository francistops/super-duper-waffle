import pool from "../db/pool.js";

//debug
export async function debugFetchAllTasks() {
  const selectSql = `SELECT * FROM "tasks"`;
  const queryResult = await pool.query(selectSql);
  return queryResult.rows;
};
export async function fetchAllTasksByProject(project) {
  return 'fetchTaskByProject niy'
};

export async function fetchAllTasksByUser(id) {
  return 'fetchAllTasksByUser niy'
};

export async function fetchNextTasks(ids, nbRequested) {
  return "fetchNextTasks niy"
};

export async function insertTaskByProject(Task) {
  return 'insertTaskByProject niy'
};
