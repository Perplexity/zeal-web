import { Button, colors, makeStyles } from "@material-ui/core";
import PauseIcon from "@material-ui/icons/Pause";
const useStyles = makeStyles(() => ({
	root: {
		backgroundColor: colors.orange[600],
		"&:hover": {
			backgroundColor: colors.orange[800],
		},
	},
}));

const PauseButton = (): JSX.Element => {
	const classes = useStyles();
	return (
		<Button
			startIcon={<PauseIcon />}
			variant="contained"
			color="primary"
			className={classes.root}
		>
      Pause
		</Button>
	);
};

export default PauseButton;
