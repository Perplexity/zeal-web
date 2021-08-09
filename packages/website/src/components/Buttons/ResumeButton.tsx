import { Button, colors, makeStyles } from "@material-ui/core";
import PlayIcon from "@material-ui/icons/PlayArrow";
const useStyles = makeStyles(() => ({
	root: {
		backgroundColor: colors.green[600],
		"&:hover": {
			backgroundColor: colors.green[800],
		},
	},
}));

const ResumeButton = (): JSX.Element => {
	const classes = useStyles();
	return (
		<Button
			startIcon={<PlayIcon />}
			variant="contained"
			color="primary"
			className={classes.root}
		>
      Resume
		</Button>
	);
};

export default ResumeButton;
