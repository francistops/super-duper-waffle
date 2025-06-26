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
  const sql = `SELECT "users"."email",
                      "users"."id",
                      "users"."passhash",
                      "tokens"."token",
                      "tokens"."expires"
                FROM "users"
                LEFT JOIN "tokens" ON "users"."id" = "tokens"."userid"
                ORDER BY "users"."email";`;
  const queryResult = await pool.query(sql);
  return queryResult.rows;
}

export async function fetchAllTokens() {
  const sql = `SELECT * FROM "tokens"`;
  const queryResult = await pool.query(sql);
  return queryResult.rows;
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
  const insertSql = `INSERT INTO users ("email", "passhash") 
                      VALUES ($1, $2)
                      returning *;`;
  const param = [
    user.email,
    hash(user.passhash),
  ];
  const queryResult = await pool.query(insertSql, param);
  console.log(queryResult.rows[0]);
  return queryResult.rows[0];
}

export async function isUserValid(email, passhash) {
  console.log('isUserValid passhash: ', passhash);
  const sql = `SELECT "email", "passhash" FROM "users" WHERE "email"=$1 AND "passhash"=$2;`;
  let param = [];
  if (email=='a' || email=='u' || email=='f') {
    param = [email, passhash];
  } else {
    param = [email, hash(passhash)];
  };
  
  console.log('isUserValid hashagain param: ', param[1]);

  const queryResult = await pool.query(sql, param);
  console.log('queryResult: ', queryResult.rows[0])
  if (queryResult.rowCount != 1) {
    throw new Error(`401: failed to authorize`);
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
    throw new Error(`User not found with email ${email}`);
  }
  if (queryResult.rowCount > 1) {
    throw new Error(`Error 500: Too many users retrieve for email ${email}.`);
  }
  console.log('fetchDetailsByEmail queryResult: ', queryResult.rows[0].id);
  return queryResult.rows[0].id;
}

export async function logoutByToken(token) {
  // console.log('--- in logout model ---');
   const sqlUpdatedToken = `UPDATE "tokens" 
                        SET "expires" = NOW() 
                        WHERE "token" = $1
                        RETURNING *;`;

  const updateResult = await pool.query(sqlUpdatedToken, [token]);
  return (updateResult.rowCount == 1) ?  true : false
}