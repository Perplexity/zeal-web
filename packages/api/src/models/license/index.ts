import moment from 'moment';
import { OkPacket, RowDataPacket } from 'mysql2';
import { License } from 'src/types';
import { db } from '../../db';

export const findOne = async (license_id: number): Promise<any> => {
	const query = `
  SELECT
	* 
FROM
	licenses l
	INNER JOIN license_types lt ON lt.id = l.license_type 
WHERE
	l.id = ?
  `;
	const [result] = await db.promise().query(query, license_id);
	const rows = <RowDataPacket[]> result;
	const licenses = <any[]>rows;
	if(licenses.length > 0) {
		const row = (<RowDataPacket>rows)[0];
		return {...row};
	}
	return null;
};

export const fromUser = async (user_id: number): Promise<License> => {
	const query = `
  SELECT
	lt.\`name\` AS \`name\`,
	l.\`key\` AS \`key\`,
	lr.date_redeemed AS date_redeemed,
	lr.date_expires AS date_expires,
	lt.job_limit AS job_limit,
	lt.thread_limit AS thread_limit,
	lt.combo_limit AS combo_limit 
FROM
	license_redemptions lr
	INNER JOIN licenses l ON l.id = lr.license_id
	INNER JOIN license_types lt ON lt.id = l.license_type 
WHERE
	lr.user_id = ? 
	AND lr.date_expires >= ?
  `;
	const [result] = await db.promise().query(query, [user_id, moment().valueOf()]);
	const rows = <RowDataPacket[]>result;
	const licenses = <any[]>rows;
	if (licenses.length > 0) {
		const row = (<RowDataPacket>rows)[0];
		const license: License = {
			...row,
		};
		return license;
	}
	return null;
};

export const fromKey = async (license_key: string): Promise<number | false> => {
	const query = 'SELECT * FROM licenses WHERE `key` = ? AND redeemed = 0';
	const [result] = await db.promise().query(query, license_key);
	const rows = <RowDataPacket[]>result;
	const licenses = <any[]>rows;
	if(licenses.length > 0) {
		const row = (<RowDataPacket>rows)[0];
		return row.id as number;
	}
	return false;
};

export const redeem = async (user_id: number, license_id: number): Promise<boolean> => {
	const license = await findOne(license_id);
	if(license) {
		let query = 'INSERT INTO license_redemptions (user_id, license_id, date_redeemed, date_expires) VALUES (?, ?, ?, ?)';
		const now = moment().valueOf();
		let [result] = await db.promise().query(query, [user_id, license_id, now, now + license.sub_time]);
		let ok = (<OkPacket>result);
		if(ok.insertId > 0) {
			query = 'UPDATE licenses SET redeemed = 1 WHERE id = ?';
			[result] = await db.promise().query(query, license_id);
			ok = (<OkPacket>result);
			return ok.affectedRows > 0;
		}
		return false;
	}
	return false;
};