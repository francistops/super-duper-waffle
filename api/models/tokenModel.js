import pool from "../db/pool.js";

export async function isTokenValid(token) {
  const sql = `SELECT "expires", "tokenUuid"
                FROM "tokens"
                WHERE "tokenUuid" = $1
                AND "expires" >= NOW();`;
  const queryResult = await pool.query(sql, [token]);
  if (queryResult.rowCount != 1) {
    throw new Error("error 401: not a valid token");
  }

  // console.log('in isTokenValid model', queryResult.rows[0].tokenUuid);
  return queryResult.rows[0].tokenUuid;
}

export async function assignToken(userId) {
  // todo separate in 2
  const checkSql = `
                    SELECT * 
                      FROM "tokens"
                      WHERE "userid" = $1
                      AND "expires" > NOW()`;
  const checkResult = await pool.query(checkSql, [userId]);
  // commented for debug purpose
  // if (checkResult.rowCount > 0) {
  //   throw new Error(`User already logged in`);
  // }
  const debugSql = `UPDATE "tokens" 
                        SET "token" = gen_random_uuid(),
                            "expires" = NOW() + INTERVAL '30 days'
                        WHERE "userid" = $1
                        returning *;`;

  //commmented for debug purpose
  // const sql = `INSERT into "tokens" ("userid") 
  //               values ($1)
  //               returning *;`;
  const queryResult = await pool.query(debugSql, [userId]);
  return queryResult.rows[0].token;  
}

export async function fetchByToken(token) {
  const sql = `SELECT * 
                FROM "tokens"
                WHERE "tokenUuid" = $1;`;
  const param = [token];
  const queryResult = await pool.query(sql, param);
  if (queryResult.rowCount != 1) {
    throw new Error(`Error 500: Too many tokens retrieve for token ${token}.`);
  }
  return queryResult.rows[0];
}