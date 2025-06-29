import pool from "../db/pool.js";
import { createHash } from "crypto";

const SALT = "monGrainDeCummin";

function hash(passHash) {
  return createHash("sha256")
    .update(SALT + passHash)
    .digest("hex");
}

export async function fetchUserById(id) {
  const sql = `SELECT * 
                        FROM "users"
                        WHERE "userUuid" = $1`;
  const queryResult = await pool.query(sql, [id]);

  if (queryResult.rowCount > 1) {
    throw new Error(`Too many users retrieve for id ${id}.`);
  }

  return queryResult.rows[0];
}

export async function insertUser(user) {
  const insertSql = `INSERT INTO users ("email", "passhash", "role") 
                      VALUES ($1, $2, $3)
                      returning *;`;
  const param = [
    user.email,
    hash(user.passhash),
    user.role
  ];
  const queryResult = await pool.query(insertSql, param);
  if (queryResult.rowCount != 1) {
    throw new Error(`501: failed too many users: ${param}`);
  }
  return true;
}

export async function isUserValid(email, passhash) {
  const sql = `SELECT "email", "passhash" FROM "users" WHERE "email"=$1 AND "passhash"=$2;`;
  const param = [email, hash(passhash)];
  const queryResult = await pool.query(sql, param);
  if (queryResult.rowCount != 1) {
    throw new Error(`501: failed to authorize on db: ${param}`);
  }
  return true;
}

export async function fetchIdByEmail(email) {
  const selectSql = `SELECT "id", "email"
                      FROM "users"
                      WHERE email = $1`;
  const parameters = [email];
  const queryResult = await pool.query(selectSql, parameters);
  if (queryResult.rowCount === 0) {
    throw new Error(`504: User not found with email ${email}`);
  }
  if (queryResult.rowCount > 1) {
    throw new Error(`Error 500: Too many users retrieve for email ${email}.`);
  }

  return queryResult.rows[0].id;
}

export async function logoutByToken(token) {
   const sqlUpdatedToken = `UPDATE "tokens" 
                        SET "expires" = NOW() 
                        WHERE "token" = $1
                        RETURNING *;`;

  const updateResult = await pool.query(sqlUpdatedToken, [token]);
  return (updateResult.rowCount == 1) ?  true : false
}

export async function fetchByRole(role) {
  const query = `SELECT * FROM "users" WHERE "role" = $1`;
  const result = await pool.query(query, [role]);
  return result.rows;
}

