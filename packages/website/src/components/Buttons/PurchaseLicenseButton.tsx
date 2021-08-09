import { Button, colors, makeStyles } from "@material-ui/core";
import PurchaseIcon from "@material-ui/icons/ShoppingCart";
const useStyles = makeStyles(() => ({
	root: {
		backgroundColor: colors.green[500],
		"&:hover": {
			backgroundColor: colors.green[800],
		},
	},
}));

const PurchaseLicenseButton = (): JSX.Element => {
	const classes = useStyles();
	return (
		<Button
			startIcon={<PurchaseIcon />}
			variant="contained"
			color="primary"
			className={classes.root}
		>
      Purchase License
		</Button>
	);
};

export default PurchaseLicenseButton;
