import axios from "axios";
import { Job, Summoner, User } from "../../types";

export const getUser = async (): Promise<User> => {
	const result = await axios.get("api/user/me");
	return result.data as User;
};

export const getJobs = async (): Promise<Job[]> => {
	const result = await axios.get("api/jobs");
	return result.data as Job[];
};

export const getResults = async (job_id: number): Promise<Summoner[]> => {
	const result = await axios.get(`api/jobs/results/${job_id}`);
	return result.data as Summoner[];
};

export const redeemKey = async (license_key: string): Promise<boolean> => {
	try {
		await axios.post("api/license/redeem", {
			key: license_key,
		});
		return true;
	} catch (e) {
		throw e.response.data.error;
	}
};
