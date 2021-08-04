import { RowDataPacket } from "mysql2";
import { Combo, ComboStats } from "../../types";
import { db } from "../../db";

export const pendingFromJob = async (job_id: number): Promise<Combo[]> => {
	const query = "SELECT * FROM combos WHERE job_id = ? AND status = 'Pending'";
	const [result] = await db.promise().query(query, job_id);
	const rows = <RowDataPacket[]>result;
	const combos: Combo[] = rows.map((combo) => {
		return {
			id: combo.id,
			job_id: combo.job_id,
			username: combo.username,
			password: combo.password,
			status: combo.status,
			result: combo.result,
		};
	});
	return combos;
};

export const getStats = async (user_id: number): Promise<ComboStats> => {
	const query = `
  SELECT
	(
	SELECT
		Count( c.id ) 
	FROM
		combos c
		INNER JOIN jobs j ON j.user_id = ? 
		AND c.job_id = j.id 
	WHERE
		c.result = "failed" 
	) AS failed,
	(
	SELECT
		Count( c.id ) 
	FROM
		combos c
		INNER JOIN jobs j ON j.user_id = ? 
		AND c.job_id = j.id 
	WHERE
		c.result = "success" 
	) AS hits,
	(
	SELECT
		Count( c.id ) 
	FROM
		combos c
		INNER JOIN jobs j ON j.user_id = ? 
		AND c.job_id = j.id 
	WHERE
	c.result = "pending" 
	) AS pending
  `;
	const [rows] = await db.promise().query(query, [user_id, user_id, user_id]);
	const row = (<RowDataPacket>rows)[0];
	const stats: ComboStats = { ...row };
	return stats;
};
