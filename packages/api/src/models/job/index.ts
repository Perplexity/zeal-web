import moment from 'moment';
import { OkPacket, RowDataPacket } from 'mysql2';
import { ComboResult, Job, Summoner } from 'src/types';
import { db } from '../../db';

export const findAll = async (user_id: number): Promise<Job[]> => {
	const query = `
  SELECT
	j.*,
	(
	SELECT
	IF
		(
			j.STATUS = "Running",
			ROUND( UNIX_TIMESTAMP( CURTIME( 4 )) * 1000 ) - j.start_time,
			j.end_time - j.start_time 
		)) AS run_time,
	( SELECT COUNT(*) FROM combos c WHERE c.job_id = j.id ) AS total,
	( SELECT COUNT(*) FROM combos c WHERE c.job_id = j.id AND c.STATUS = "Completed" ) AS completed,
	( SELECT COUNT(*) FROM combos c WHERE c.job_id = j.id AND c.result = "Success" ) AS hits,
	( SELECT COUNT(*) FROM combos c WHERE c.job_id = j.id AND c.result = "Failed" ) AS fails 
FROM
	jobs j 
WHERE
	j.user_id = ?
  `;
	const [result] = await db.promise().query(query, user_id);
	const rows = <RowDataPacket[]>result;
	const jobs: Job[] = rows.map((job) => {
		return {
			id: job.id,
			threads: job.threads,
			region: job.region,
			mode: job.mode,
			min_level: job.min_level,
			capture_bans: job.capture_bans,
			hits: job.hits,
			fails: job.fails,
			progress: {
				current: job.completed,
				total: job.total,
			},
			run_time: job.run_time,
			status: job.status,
		};
	});
	return jobs;
};

export const belongsToUser = async (job_id: number, user_id: number): Promise<boolean> => {
	const query = 'SELECT * FROM jobs WHERE id = ? AND user_id = ?';
	const [rows] = await db.promise().query(query, [job_id, user_id]);
	const jobs = <any[]>rows;
	return jobs.length > 0;
};

export const setComboResult = async (
	combo_id: number,
	combo_result: ComboResult
): Promise<boolean> => {
	const query =
		'UPDATE combos SET status = \'Completed\', result = ? WHERE id = ?';
	const [result] = await db.promise().query(query, [combo_result, combo_id]);
	return (<OkPacket>result).affectedRows > 0;
};

export const markAsCompleted = async (job_id: number): Promise<boolean> => {
	const query = 'UPDATE jobs SET status = \'Completed\', end_time = ? WHERE id = ?';
	const [result] = await db.promise().query(query, [moment().valueOf(), job_id]);
	return (<OkPacket>result).affectedRows > 0;
};

export const addHit = async (combo_id: number, summoner: Summoner): Promise<number> => {
	const query = `INSERT INTO hits (combo_id, summoner_id, region, email_verified, phone_verified, summoner_name, level, last_played, solo_queue_rank, solo_queue_lp, solo_queue_wins, solo_queue_losses, flex_queue_rank, flex_queue_lp, flex_queue_wins, flex_queue_losses, riot_points, blue_essence, refund_credits, refundable_rp, refundable_be, champions, skins, banned, toxic_banned) 
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
	const [result] = await db
		.promise()
		.query(query, [
			combo_id,
			summoner.id,
			summoner.region,
			summoner.email_verified,
			summoner.phone_verified,
			summoner.summoner_name,
			summoner.level,
			summoner.last_played,
			summoner.solo_queue.rank,
			summoner.solo_queue.lp,
			summoner.solo_queue.wins,
			summoner.solo_queue.losses,
			summoner.flex_queue.rank,
			summoner.flex_queue.lp,
			summoner.flex_queue.wins,
			summoner.flex_queue.losses,
			summoner.riot_points,
			summoner.blue_essence,
			summoner.refund_credits,
			summoner.refundable_rp,
			summoner.refundable_be,
			summoner.champions.join(','),
			summoner.skins.join(','),
			summoner.banned,
			summoner.toxic_banned,
		]);
	return (<OkPacket>result).insertId;
};
