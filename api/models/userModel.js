import pool from "../db/pool.js";
import { createHash } from "crypto";

const SALT = "monGrainDeCummin";

function hash(passHash) {
  return createHash("sha256")
    .update(SALT + passHash)
    .digest("hex");
}

//debug
export async function fetchAllUsers() {
  const selectSql = `SELECT * FROM "users", "tokens"`;
  const queryResult = await query(selectSql);
  return queryResult.rows;
}

export async function fetchUserById(id) {
  const selectSql = `SELECT * 
                        FROM "users"
                        WHERE "userUuid" = $1`;
  const parameters = [id];
  const queryResult = await query(selectSql, parameters);

  if (queryResult.rowCount > 1) {
    throw new Error(`Too many users retrieve for id ${id}.`);
  }

  return queryResult.rows[0];
}

export async function insertUser(user) {
  // console.log('user: ',user)
  const insertSql = `INSERT INTO users ("email", "passHash", "firstName", "lastName") 
                      VALUES ($1, $2, $3, $4)
                      returning *;`;
  const parameters = [
    user.email,
    user.passHash,
    user.firstName,
    user.lastName,
  ];
  const queryResult = await query(insertSql, parameters);
  hasAffectedOne(null, "inserted", queryResult);
  
  return queryResult.rows[0];
}

export async function isUserValid(email, passHash) {
  const sql = `SELECT "email" "passHash" FROM "users" WHERE "email"=$1 AND "passHash"=$2;`;
  const param = [email, passHash];
  const queryResult = await query(sql, param);
  if (queryResult.rowCount != 1) {
    throw new Error(`401: failed to authorize`);
  }
  return true;
}

export async function fetchDetailsByEmail(email) {
  const selectSql = `SELECT * 
                      FROM "users"
                      WHERE email = $1`;
  const parameters = [email];
  const queryResult = await query(selectSql, parameters);

  if (queryResult.rowCount > 1) {
    throw new Error(`Error 500: Too many users retrieve for id ${id}.`);
  }

  return queryResult.rows[0];
}

export async function logoutByToken(token) {
  // console.log('--- in logout model ---');
   const sqlUpdatedToken = `UPDATE "tokens" 
                        SET "expires" = NOW() 
                        WHERE "tokenUuid" = $1
                        RETURNING *;`;

  const updateResult = await query(sqlUpdatedToken, [token]);
  return (updateResult.rowCount == 1) ?  true : false
}