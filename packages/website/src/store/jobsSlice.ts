import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../app/store';
import { Job, Summoner } from '../types';

interface JobsState {
  loading: boolean;
  jobs: Job[];
  fetching_results: boolean;
  results: Summoner[];
  creating_job: boolean;
}

const initialState: JobsState = {
  loading: true,
  jobs: [],
  fetching_results: false,
  results: null,
  creating_job: false
};

export const jobsSlice = createSlice({
  name: 'jobs',
  initialState,
  reducers: {
    setLoading: (state: JobsState, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setJobs: (state: JobsState, action: PayloadAction<Job[]>) => {
      state.jobs = action.payload;
    },
    setFetchingResults: (state: JobsState, action: PayloadAction<boolean>) => {
      state.fetching_results = action.payload;
    },
    setResults: (state: JobsState, action: PayloadAction<Summoner[]>) => {
      state.results = action.payload;
    },
    setCreatingJob: (state: JobsState, action: PayloadAction<boolean>) => {
      state.creating_job = action.payload;
    },
    reset: () => initialState
  }
});

export const { setLoading, setJobs, setFetchingResults, setResults, setCreatingJob, reset} = jobsSlice.actions;
export const selectJobs = (state: RootState) => state.jobsReducer;

export default jobsSlice.reducer;
