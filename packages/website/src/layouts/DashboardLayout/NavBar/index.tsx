import { useEffect } from 'react';
import {
  Avatar,
  Box,
  Button,
  Divider,
  Drawer,
  Hidden,
  List,
  Typography,
  makeStyles,
  CircularProgress,
  Theme,
} from '@material-ui/core';
import { BarChart as BarChartIcon, LogOut, Briefcase } from 'react-feather';
import NavItem from './NavItem';
import { purple } from '@material-ui/core/colors';
import { useCookies } from 'react-cookie';
import logo from '../../../images/zeal-logo.png';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import {
  selectUser,
  setLoading as setUsersLoading,
  setUser,
  reset as userReset,
} from '../../../store/userSlice';
import { reset as jobsReset, selectJobs, setJobs, setLoading as setJobsLoading } from '../../../store/jobsSlice';
import { getJobs, getUser } from '../../../api/user';

const items = [
  {
    href: '/dashboard/home',
    icon: BarChartIcon,
    title: 'Dashboard',
  },
  {
    href: '/dashboard/jobs',
    icon: Briefcase,
    title: 'Jobs',
  },
];

const useStyles = makeStyles((theme: Theme) => ({
  mobileDrawer: {
    width: 256,
  },
  desktopDrawer: {
    width: 256,
    top: 64,
    height: 'calc(100% - 64px)',
  },
  avatar: {
    cursor: 'pointer',
    width: 64,
    height: 64,
  },
  chip: {
    color: purple[800],
    borderColor: purple[800],
    padding: theme.spacing(1),
    textTransform: 'capitalize',
  },
}));

const NavBar = ({ onMobileClose, openMobile }) => {
  const classes = useStyles();
  const dispatch = useAppDispatch();
  const userState = useAppSelector(selectUser);
  const jobsState = useAppSelector(selectJobs);
  const { loading: users_loading, user } = userState;
  const { loading: jobs_loading } = jobsState;
  const [, , removeCookie] = useCookies(['auth_token']);

  const doLogout = () => {
    dispatch(userReset());
    dispatch(jobsReset());
    removeCookie('auth_token', { path: '/' });
  };

  useEffect(() => {
    if (openMobile && onMobileClose) {
      onMobileClose();
    }
    if (users_loading) {
      getUser().then((myUser) => {
        dispatch(setUser(myUser));
        dispatch(setUsersLoading(false));
      });
    }
    if(jobs_loading) {
      getJobs().then((jobs) => {
        dispatch(setJobs(jobs));
        dispatch(setJobsLoading(false));
      });
    }
  }, [dispatch, jobs_loading, onMobileClose, openMobile, users_loading]);
  const content = (
    <Box height="100%" display="flex" flexDirection="column">
      <Box alignItems="center" display="flex" flexDirection="column" p={2}>
        {users_loading ? (
          <CircularProgress />
        ) : (
          <>
            <Avatar className={classes.avatar} src={logo} />
            <Typography color="textPrimary" variant="subtitle1">
              {user.username}
            </Typography>
            <Button
              startIcon={<LogOut size={20} />}
              size="small"
              variant="contained"
              onClick={() => doLogout()}
            >
              Sign out
            </Button>
          </>
        )}
      </Box>
      <Divider />
      <Box p={2}>
        <List>
          {items.map((item) => (
            <NavItem
              href={item.href}
              key={item.title}
              title={item.title}
              icon={item.icon}
            />
          ))}
        </List>
      </Box>
      <Box flexGrow={1} />
    </Box>
  );

  return (
    <>
      <Hidden lgUp>
        <Drawer
          anchor="left"
          classes={{ paper: classes.mobileDrawer }}
          onClose={onMobileClose}
          open={openMobile}
          variant="temporary"
        >
          {content}
        </Drawer>
      </Hidden>
      <Hidden mdDown>
        <Drawer
          anchor="left"
          classes={{ paper: classes.desktopDrawer }}
          open
          variant="persistent"
        >
          {content}
        </Drawer>
      </Hidden>
    </>
  );
};

export default NavBar;
