import {
	Box,
	CircularProgress,
	colors,
	Container,
	Grid,
	makeStyles,
	Theme,
	Typography,
} from "@material-ui/core";
import Page from "../../components/Page";
import JobsCard from "../../components/Dashboard/Statistics/JobsCard";
import theme from "../../theme";
import NewsCard from "../../components/Dashboard/Statistics/NewsCard";
import CombosCard from "../../components/Dashboard/Statistics/CombosCard";
import LicenseCard from "../../components/Dashboard/Statistics/LicenseCard";
import { useAppSelector } from "../../app/hooks";
import { selectUser } from "../../store/userSlice";
import { selectJobs } from "../../store/jobsSlice";

const useStyles = makeStyles((theme: Theme) => ({
	root: {
		backgroundColor: theme.palette.background.default,
		minHeight: "100%",
		paddingBottom: theme.spacing(3),
		paddingTop: theme.spacing(3),
	},
	avatar: {
		backgroundColor: colors.purple[600],
		height: 56,
		width: 56,
	},
	differenceIcon: {
		color: colors.red[900],
	},
	differenceValue: {
		color: colors.red[900],
		marginRight: theme.spacing(1),
	},
}));

const DashboardView = (): JSX.Element => {
	const classes = useStyles();
	const userState = useAppSelector(selectUser);
	const jobsState = useAppSelector(selectJobs);
	const { loading: users_loading } = userState;
	const { loading: jobs_loading } = jobsState;
	return (
		<Page title="Dashboard" className={classes.root}>
			<Container maxWidth={false}>
				<Box style={{ paddingBottom: theme.spacing(2) }}>
					<Grid container justify="center">
						<Box>
							<Typography variant="h1" gutterBottom>
                Statistics
							</Typography>
						</Box>
					</Grid>
					<Grid container spacing={3} justify="center">
						{users_loading || jobs_loading ? (
							<CircularProgress />
						) : (
							<>
								<Grid item lg={6} sm={6} xl={3} xs={12}>
									<LicenseCard />
								</Grid>
								<Grid item lg={6} sm={6} xl={3} xs={12}>
									<JobsCard />
								</Grid>
								<Grid item lg={6} sm={6} xl={3} xs={12}>
									<CombosCard />
								</Grid>
							</>
						)}
					</Grid>
				</Box>
				<Box style={{ paddingBottom: theme.spacing(2) }}>
					<Box>
						<Typography variant="h1" gutterBottom>
              Updates & News
						</Typography>
					</Box>
					<Grid container>
						<Grid item xs={12}>
							<NewsCard />
						</Grid>
					</Grid>
				</Box>
			</Container>
		</Page>
	);
};

export default DashboardView;
