import {
	Avatar,
	Box,
	Card,
	CardContent,
	Grid,
	Typography,
	colors,
	makeStyles,
	CircularProgress,
} from "@material-ui/core";
import { Award } from "react-feather";
import { useAppSelector } from "../../../app/hooks";
import { selectUser } from "../../../store/userSlice";
import NoLicense from "../NoLicense";
import moment from "moment";
import NumberFormat from "react-number-format";

const useStyles = makeStyles((theme) => ({
	root: {
		height: "100%",
	},
	avatar: {
		height: 56,
		width: 56,
		backgroundColor: colors.cyan[800],
	},
	license: {
		height: 56,
		width: 56,
		backgroundColor: "white",
	},
	differenceIcon: {
		color: colors.red[900],
	},
	differenceValue: {
		color: colors.red[900],
		marginRight: theme.spacing(1),
	},
}));

const LicenseCard = (): JSX.Element => {
	const classes = useStyles();
	const userState = useAppSelector(selectUser);
	const { user, loading } = userState;

	return loading ? (
		<CircularProgress />
	) : (
		<Card className={classes.root}>
			<CardContent>
				<Grid container justify="space-between" spacing={3}>
					<Grid item>
						<Typography color="textSecondary" gutterBottom variant="h6">
              LICENSE
						</Typography>
					</Grid>
					<Grid item>
						<Avatar className={user.license ? classes.license : classes.avatar}>
							{user.license ? (
								<img
									alt={user.license.name}
									width={56}
									height={56}
									src={
										user.license
											? `/images/ranked_emblems/Emblem_${user.license.name}.png`
											: null
									}
								/>
							) : (
								<Award />
							)}
						</Avatar>
					</Grid>
				</Grid>
				<Grid container spacing={3}>
					{user.license ? (
						<Grid item>
							<Box display="flex">
								<Typography variant="button">
                  Tier: <b>{user.license.name}</b>
								</Typography>
							</Box>
							<Box display="flex">
								<Typography variant="button">
                  Expires:{" "}
									<b>
										{moment(user.license.date_expires).format(
											"DD/MM/YYYY HH:mm:ss"
										)}
									</b>
								</Typography>
							</Box>
							<Box display="flex">
								<Typography variant="button">
                  Job Limit: <b>{user.license.job_limit}</b>
								</Typography>
							</Box>
							<Box display="flex">
								<Typography variant="button">
                  Thread Limit: <b>{user.license.thread_limit}</b>
								</Typography>
							</Box>
							<Box display="flex">
								<Typography variant="button">
                  Combo Limit:{" "}
									<b>
										<NumberFormat
											value={user.license.combo_limit}
											thousandSeparator={true}
											displayType="text"
										/>
									</b>
								</Typography>
							</Box>
						</Grid>
					) : (
						<NoLicense />
					)}
				</Grid>
			</CardContent>
		</Card>
	);
};

export default LicenseCard;
