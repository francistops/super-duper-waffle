import pool from "../db/pool.js";

export async function fetchServices() {
    const { rows } = await pool.query(`SELECT *
							FROM services
							ORDER BY name ASC;`);
    return rows;
}
