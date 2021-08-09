import {
	Avatar,
	Box,
	Card,
	CardContent,
	Grid,
	Typography,
	colors,
	makeStyles,
} from "@material-ui/core";
import { Users } from "react-feather";
import CheckIcon from "@material-ui/icons/CheckSharp";
import CrossIcon from "@material-ui/icons/Clear";
import TimerIcon from "@material-ui/icons/Timer";
import { Doughnut } from "react-chartjs-2";
import { useAppSelector } from "../../../app/hooks";
import { selectUser } from "../../../store/userSlice";

const useStyles = makeStyles((theme) => ({
	root: {
		height: "100%",
	},
	avatar: {
		height: 56,
		width: 56,
		backgroundColor: colors.green[800],
	},
	differenceIcon: {
		color: colors.red[900],
	},
	differenceValue: {
		color: colors.red[900],
		marginRight: theme.spacing(1),
	},
}));

const CombosCard = (): JSX.Element => {
	const classes = useStyles();
	const userState = useAppSelector(selectUser);
	const { user } = userState;

	const comboData = [
		{
			title: "Hits",
			value: user.combo_stats.hits,
			icon: CheckIcon,
			color: colors.green[500],
		},
		{
			title: "Invalid",
			value: user.combo_stats.failed,
			icon: CrossIcon,
			color: colors.red[600],
		},
		{
			title: "Pending",
			value: user.combo_stats.pending,
			icon: TimerIcon,
			color: colors.orange[600],
		},
	];

	const data = {
		datasets: [
			{
				data: [user.combo_stats.hits, user.combo_stats.failed, user.combo_stats.pending],
				backgroundColor: [
					colors.green[500],
					colors.red[600],
					colors.orange[600],
				],
				borderWidth: 8,
				borderColor: colors.common.white,
				hoverBorderColor: colors.common.white,
			},
		],
		labels: ["Hits", "Invalid", "Pending"],
	};

	const options = {
		animation: false,
		cutoutPercentage: 70,
		legend: {
			display: false,
		},
	};

	return (
		<Card className={classes.root}>
			<CardContent>
				<Grid container justify="space-between" spacing={3}>
					<Grid item>
						<Typography color="textSecondary" gutterBottom variant="h6">
              COMBOS
						</Typography>
					</Grid>
					<Grid item>
						<Avatar className={classes.avatar}>
							<Users />
						</Avatar>
					</Grid>
				</Grid>
				<Grid container justify="center">
					<Grid item>
						<Doughnut data={data} options={options} />
					</Grid>
					<Grid item>
						<Box display="flex" justifyContent="center" mt={2}>
							{comboData.map(({ color, icon: Icon, title, value }) => (
								<Box key={title} p={1} textAlign="center">
									<Icon color="action" />
									<Typography color="textPrimary" variant="body1">
										{title}
									</Typography>
									<Typography style={{ color }} variant="h2">
										{value}
									</Typography>
								</Box>
							))}
						</Box>
					</Grid>
				</Grid>
			</CardContent>
		</Card>
	);
};

export default CombosCard;
