import {
	Avatar,
	Box,
	Card,
	CardContent,
	Grid,
	Typography,
	colors,
	makeStyles,
	Button,
	CircularProgress,
} from "@material-ui/core";
import CheckCircleIcon from "@material-ui/icons/CheckCircleOutline";
import TimerIcon from "@material-ui/icons/Timer";
import PauseIcon from "@material-ui/icons/PauseCircleOutline";
import { Eye } from "react-feather";
import { Briefcase } from "react-feather";
import theme from "../../../theme";
import { NavLink } from "react-router-dom";
import { useAppSelector } from "../../../app/hooks";
import { selectJobs } from "../../../store/jobsSlice";

const useStyles = makeStyles((theme) => ({
	root: {
		height: "100%",
	},
	avatar: {
		height: 56,
		width: 56,
		backgroundColor: colors.common[800],
	},
	differenceIcon: {
		color: colors.red[900],
	},
	differenceValue: {
		color: colors.red[900],
		marginRight: theme.spacing(1),
	},
}));

const JobsCard = (): JSX.Element => {
	const classes = useStyles();
	const jobsState = useAppSelector(selectJobs);
	const { jobs, loading } = jobsState;
	return loading ? (
		<CircularProgress />
	) : (
		<Card className={classes.root}>
			<CardContent>
				<Grid container justify="space-between" spacing={3}>
					<Grid item>
						<Typography color="textSecondary" gutterBottom variant="h6">
              JOBS
						</Typography>
						<Box
							mt={2}
							display="flex"
							alignItems="center"
							style={{ color: colors.green[500] }}
						>
							<CheckCircleIcon />
							<Typography
								variant="h5"
								color="textPrimary"
								style={{ paddingLeft: theme.spacing(1) }}
							>
								{jobs.filter(x => x.status === "Completed").length} Finished
							</Typography>
						</Box>
						<Box
							mt={2}
							display="flex"
							alignItems="center"
							style={{ color: colors.orange[600] }}
						>
							<TimerIcon />
							<Typography
								variant="h5"
								color="textPrimary"
								style={{ paddingLeft: theme.spacing(1) }}
							>
								{jobs.filter(x => x.status === "Running").length} Running
							</Typography>
						</Box>
						<Box
							mt={2}
							display="flex"
							alignItems="center"
							style={{ color: colors.grey[600] }}
						>
							<PauseIcon />
							<Typography
								variant="h5"
								color="textPrimary"
								style={{ paddingLeft: theme.spacing(1) }}
							>
								{jobs.filter(x => x.status === "Paused").length} Paused
							</Typography>
						</Box>
					</Grid>
					<Grid item>
						<Avatar className={classes.avatar}>
							<Briefcase />
						</Avatar>
					</Grid>
				</Grid>
				<Grid container>
					<Grid item>
						<Box>
							<Button
								startIcon={<Eye />}
								variant="contained"
								color="primary"
								style={{ marginTop: theme.spacing(2) }}
								component={NavLink}
								to="/dashboard/jobs"
							>
                View Jobs
							</Button>
						</Box>
					</Grid>
				</Grid>
			</CardContent>
		</Card>
	);
};

export default JobsCard;
