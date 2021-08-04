import { RowDataPacket } from "mysql2";
import { Summoner } from "../../types";
import { db } from "../../db";

export const fromJob = async (job_id: number): Promise<Summoner[]> => {
	const query = `
  SELECT
	h.*,
	c.username,
	c.password 
FROM
	hits h
	INNER JOIN combos c ON c.job_id = ? 
	AND c.id = h.combo_id
  `;
	const [result] = await db.promise().query(query, job_id);
	const rows = <RowDataPacket[]>result;
	const hits: Summoner[] = rows.map((row) => {
		return {
			id: row.summoner_id,
			region: row.region,
			username: row.username,
			password: row.password,
			email_verified: row.email_verified,
			phone_verified: row.phone_verified,
			summoner_name: row.summoner_name,
			level: row.level,
			last_played: row.last_played,
			solo_queue: {
				rank: row.solo_queue_rank,
				lp: row.solo_queue_lp,
				wins: row.solo_queue_wins,
				losses: row.solo_queue_losses,
			},
			flex_queue: {
				rank: row.flex_queue_rank,
				lp: row.flex_queue_lp,
				wins: row.flex_queue_wins,
				losses: row.flex_queue_losses,
			},
			riot_points: row.riot_points,
			blue_essence: row.blue_essence,
			refund_credits: row.refund_credits,
			refundable_rp: row.refundable_rp,
			refundable_be: row.refundable_be,
			champions: row.champions.split(","),
			skins: row.skins ? row.skins.split(",") : [],
			banned: row.banned,
			toxic_banned: row.toxic_banned,
		};
	});
	return hits;
};
