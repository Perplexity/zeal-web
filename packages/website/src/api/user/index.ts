import axios from 'axios';
import { Job, Summoner, User } from '../../types';

export const getUser = async () => {
  const result = await axios.get('api/user/me');
  return result.data as User;
};

export const getJobs = async () => {
  const result = await axios.get('api/jobs');
  return result.data as Job[];
};

export const getResults = async (job_id: number) => {
  const result = await axios.get(`api/jobs/results/${job_id}`);
  return result.data as Summoner[];
};

export const redeemKey = async (license_key: string) => {
  try {
    await axios.post('api/license/redeem', {
      key: license_key,
    });
    return true;
  } catch (e) {
    throw e.response.data.error;
  }
};
