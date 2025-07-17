import pool from "../db/pool.js";

export async function fetchServices() {
	const { rows } = await pool.query(`SELECT *
							FROM services
							`);
	return rows;
}

export async function insertService(service) {
	const { rows } = await pool.query(
		`INSERT INTO services ("name", "price", "duration") 
		 VALUES ($1, $2, $3)
		 RETURNING *;`,
		[service.name, service.price, service.duration || 60]
	);
	return rows[0];
}

export async function isServiceExist(name) {
	const { rows } = await pool.query(
		`SELECT 1 FROM services
		 WHERE "name" = $1
		 LIMIT 1;`,
		[name]
	);
	return rows.length === 1;
}
