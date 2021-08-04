import Page from '../../components/Page';
import PerfectScrollbar from 'react-perfect-scrollbar';
import JobsTable from '../../components/Dashboard/Jobs/JobsTable';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
  selectJobs,
  setCreatingJob,
  setFetchingResults,
  setJobs,
  setLoading,
  setResults,
} from '../../store/jobsSlice';
import { useEffect } from 'react';
import { getJobs, getResults } from '../../api/user';
import ResultsTable from '../../components/Dashboard/Jobs/ResultsTable';
import theme from '../../theme';
import DownloadIcon from '@material-ui/icons/CloudDownload';
import AddIcon from '@material-ui/icons/Add';
import {
  makeStyles,
  Theme,
  Container,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Button,
  Box,
  Grid,
  colors,
} from '@material-ui/core';
import { selectUser } from '../../store/userSlice';
import NoLicense from '../../components/Dashboard/NoLicense';
import CreateJob from '../../components/Dashboard/Jobs/CreateJob';
import { GridRowSelectedParams } from '../../types/material-ui';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    backgroundColor: theme.palette.background.default,
    minHeight: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3),
  },
  box: {
    paddingBottom: theme.spacing(3),
  },
  newButton: {
    backgroundColor: colors.green[500],
    '&:hover': {
      backgroundColor: colors.green[800],
    },
  },
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

const JobsView = () => {
  const classes = useStyles();
  const dispatch = useAppDispatch();
  const userState = useAppSelector(selectUser);
  const jobsState = useAppSelector(selectJobs);
  const { user } = userState;
  const { loading, jobs, fetching_results, results, creating_job } = jobsState;
  useEffect(() => {
    if (loading) {
      getJobs().then((jobs) => {
        dispatch(setLoading(false));
        dispatch(setJobs(jobs));
      });
    }

    const interval = setInterval(() => {
      getJobs().then((jobs) => {
        dispatch(setJobs(jobs));
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [dispatch, jobs, loading]);

  const handleJobSelected = (param: GridRowSelectedParams) => {
    dispatch(setFetchingResults(true));
    getResults(param.data.id).then((summoners) => {
      dispatch(setResults(summoners));
      dispatch(setFetchingResults(false));
    });
  };

  return (
    <Page title="Jobs" className={classes.root}>
      <Container maxWidth={false}>
        <Box>
          <Typography variant="h1" gutterBottom>
            Jobs
          </Typography>
        </Box>
        <Grid container spacing={3} className={classes.box}>
          <Grid item xs={12} lg={creating_job ? 9 : 12}>
            <Card>
              <CardContent>
                <PerfectScrollbar>
                  <Box>
                    <Grid
                      container
                      style={{ paddingBottom: theme.spacing(2) }}
                      justify="flex-end"
                    >
                      <Button
                        startIcon={<AddIcon />}
                        className={classes.newButton}
                        variant="contained"
                        color="primary"
                        onClick={() => dispatch(setCreatingJob(true))}
                      >
                        New Job
                      </Button>
                    </Grid>
                    <JobsTable
                      loading={loading}
                      jobs={jobs}
                      onRowSelected={handleJobSelected}
                    />
                  </Box>
                </PerfectScrollbar>
              </CardContent>
            </Card>
          </Grid>
          {creating_job && (
            <Grid item xs={12} lg={3}>
              <Card style={{ height: '100%' }}>
                <CardContent>
                  {user.license ? <CreateJob /> : <NoLicense />}
                </CardContent>
              </Card>
            </Grid>
          )}
        </Grid>
        <Box>
          <Typography variant="h1" gutterBottom>
            Results
          </Typography>
        </Box>
        <Grid container spacing={3} className={classes.box}>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <PerfectScrollbar>
                  {fetching_results ? (
                    <Grid container justify="center">
                      <CircularProgress />
                    </Grid>
                  ) : !results ? (
                    <Grid container justify="center">
                      <Typography color="textSecondary">
                        No job selected.
                      </Typography>
                    </Grid>
                  ) : (
                    <Box>
                      <Grid
                        container
                        style={{ paddingBottom: theme.spacing(2) }}
                        justify="flex-end"
                      >
                        <Button
                          startIcon={<DownloadIcon />}
                          variant="contained"
                          color="primary"
                        >
                          Download JSON
                        </Button>
                      </Grid>
                      <ResultsTable results={results} />
                    </Box>
                  )}
                </PerfectScrollbar>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
};

export default JobsView;
