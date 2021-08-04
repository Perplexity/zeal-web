import {
  Box,
  Typography,
} from '@material-ui/core';
import {
  LinearProgress,
} from '@material-ui/core';
import PauseIcon from '@material-ui/icons/Pause';
import TimerIcon from '@material-ui/icons/Timer';
import CheckIcon from '@material-ui/icons/Check';
import { Job } from '../../../types';
import PauseButton from '../../Buttons/PauseButton';
import ResumeButton from '../../Buttons/ResumeButton';
import moment from "moment";
import 'moment-duration-format';
import { GridRowSelectedParams } from '../../../types/material-ui';
import * as DataGrid from '@material-ui/data-grid';

const columns = [
  {
    field: 'id',
    headerName: 'ID',
    width: 100,
    type: 'number',
    renderCell: (params) => {
      return <Typography>{params.row.id}</Typography>;
    },
  },
  {
    field: 'threads',
    headerName: 'Threads',
    width: 130,
    type: 'number',
    renderCell: (params) => {
      return <Typography>{params.row.threads}</Typography>;
    },
  },
  {
    field: 'region',
    headerName: 'Region',
    width: 130,
    renderCell: (params) => {
      return <Typography>{params.row.region}</Typography>;
    },
  },
  {
    field: 'mode',
    headerName: 'Mode',
    width: 115,
    renderCell: (params) => {
      const job = params.row;
      return <Typography>{job.mode === 1 ? 'Crack' : 'Check'}</Typography>;
    },
  },
  {
    field: 'min_level',
    headerName: 'Min. Level',
    width: 150,
    type: 'number',
    renderCell: (params) => {
      return <Typography>{params.row.min_level}</Typography>;
    },
  },
  {
    field: 'capture_bans',
    headerName: 'Capture Bans',
    width: 170,
    type: 'boolean',
  },
  {
    field: 'hits',
    headerName: 'Hits',
    width: 110,
    type: 'number',
    renderCell: (params) => {
      return <Typography>{params.row.hits}</Typography>;
    },
  },
  {
    field: 'fails',
    headerName: 'Fails',
    width: 110,
    type: 'number',
    renderCell: (params) => {
      return <Typography>{params.row.fails}</Typography>;
    },
  },
  {
    field: 'progress.current',
    headerName: 'Progress',
    width: 300,
    type: 'number',
    renderCell: (params) => {
      const job = params.row;
      return (
        <Box width="100%">
          <Typography variant="subtitle2">
            {Math.round((job.progress.current / job.progress.total) * 100)}%
          </Typography>
          <LinearProgress
            value={(job.progress.current / job.progress.total) * 100}
            variant="determinate"
          />
          <Typography variant="subtitle2">
            {job.progress.current} / {job.progress.total}
          </Typography>
        </Box>
      );
    },
  },
  {
    field: 'status',
    headerName: 'Status',
    width: 125,
    renderCell: (params) => {
      const job = params.row;
      return (
        <Box display="flex" alignItems="center">
          {job.status === 'Running' && <TimerIcon />}
          {job.status === 'Paused' && <PauseIcon />}
          {job.status === 'Completed' && <CheckIcon />}
          <Typography>{job.status}</Typography>
        </Box>
      );
    },
  },
  {
    field: 'run_time',
    headerName: 'Run Time',
    width: 150,
    type: 'number',
    renderCell: (params) => {
      const job = params.row;
      const duration = moment.duration(job.run_time);
      return <Typography>{duration.format("hh:mm:ss", 0, {trim: false})}</Typography>
    }
  },
  {
    field: 'null',
    headerName: 'Action(s)',
    width: 200,
    sortable: false,
    renderCell: (params) => {
      const job = params.row;
      return (
        <>
          {job.status === 'Running' && (
            <PauseButton/>
          )}
          {job.status === 'Paused' && (
            <ResumeButton/>
          )}
        </>
      );
    },
  },
];

type Props = {
  loading: boolean;
  jobs: Job[];
  onRowSelected?: (param: GridRowSelectedParams) => void;
};

const JobsTable = ({ loading, jobs, onRowSelected }: Props) => {
  return (
    <div style={{ height: 500 }}>
      <DataGrid.DataGrid columns={columns} rows={jobs} loading={loading} onRowSelected={onRowSelected}/>
    </div>
  );
};
export default JobsTable;
