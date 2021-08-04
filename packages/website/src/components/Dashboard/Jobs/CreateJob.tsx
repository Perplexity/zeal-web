import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  colors,
  FormControlLabel,
  Grid,
  makeStyles,
  TextField,
  Theme,
} from '@material-ui/core';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { setCreatingJob } from '../../../store/jobsSlice';
import { selectUser } from '../../../store/userSlice';
import MinLevelSlider from './MinLevelSlider';
import ThreadsSlider from './ThreadsSlider';
import CrossIcon from '@material-ui/icons/Clear';
import CheckIcon from '@material-ui/icons/CheckSharp';
import Selector from '../../Selector';
import { useState } from 'react';
import theme from '../../../theme';

const useStyles = makeStyles((theme: Theme) => ({
  createButton: {
    width: '100%',
    backgroundColor: colors.green[500],
    '&:hover': {
      backgroundColor: colors.green[800],
    },
  },
  cancelButton: {
    width: '100%',
    backgroundColor: colors.red[500],
    '&:hover': {
      backgroundColor: colors.red[800],
    },
  },
}));

const CreateJob = () => {
  const classes = useStyles();
  const dispatch = useAppDispatch();
  const userState = useAppSelector(selectUser);
  const { user } = userState;
  const [region, setRegion] = useState('EUW');
  const [mode, setMode] = useState('Check');
  const [minLevel, setMinLevel] = useState(30);
  const [checkBanned, setCheckBanned] = useState(false);
  const [threads, setThreads] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  return (
    <Box>
      <Grid container spacing={3} style={{ paddingBottom: theme.spacing(2) }}>
        <Grid item xs={12}>
          {/* TODO: Add upload file */}
        </Grid>
      </Grid>
      <Grid container spacing={3}>
        <Grid item xs={6}>
          <Selector
            label="Region"
            value={region}
            options={[
              'EUW',
              'EUNE',
              'NA',
              'LAN',
              'LAS',
              'RU',
              'OCE',
              'BR',
              'TR',
              'JP',
            ]}
            onChange={(e) => setRegion(e.target.value)}
          />
        </Grid>
        <Grid item xs={6}>
          <Selector
            label="Mode"
            value={mode}
            options={['Crack', 'Check']}
            onChange={(e) => setMode(e.target.value)}
          />
        </Grid>
      </Grid>
      <Grid container spacing={3}>
        <Grid item xs={6}>
          <MinLevelSlider onChange={(e) => setMinLevel(e.target.value)} />
        </Grid>
        <Grid item xs={6}>
          <FormControlLabel
            labelPlacement="top"
            control={
              <Checkbox
                checked={checkBanned}
                color="primary"
                onChange={(e) => setCheckBanned(e.target.checked)}
              />
            }
            label="Capture banned accounts"
          />
        </Grid>
      </Grid>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <ThreadsSlider
            limit={user.license.thread_limit}
            onChange={(e) => setThreads(e.target.value)}
          />
        </Grid>
      </Grid>
      <Grid container spacing={3} justify="center">
        {submitting ? (
          <CircularProgress />
        ) : (
          <>
            <Grid item xs={6}>
              <Button
                startIcon={<CrossIcon />}
                variant="contained"
                color="primary"
                className={classes.cancelButton}
                onClick={() => dispatch(setCreatingJob(false))}
              >
                Cancel
              </Button>
            </Grid>
            <Grid item xs={6}>
              <Button
                startIcon={<CheckIcon />}
                variant="contained"
                color="primary"
                className={classes.createButton}
                onClick={() => setSubmitting(true)}
              >
                Create Job
              </Button>
            </Grid>
          </>
        )}
      </Grid>
    </Box>
  );
};

export default CreateJob;
