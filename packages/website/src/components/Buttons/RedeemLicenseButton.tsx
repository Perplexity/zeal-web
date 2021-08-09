import { Button, colors, makeStyles } from "@material-ui/core";
import PurchaseIcon from "@material-ui/icons/VpnKey";
const useStyles = makeStyles(() => ({
	root: {
		backgroundColor: colors.pink[500],
		"&:hover": {
			backgroundColor: colors.pink[800],
		},
	},
}));

type Props = {
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

const RedeemLicenseButton = ({onClick}: Props): JSX.Element => {
	const classes = useStyles();
	return (
		<Button
			startIcon={<PurchaseIcon />}
			variant="contained"
			color="primary"
			className={classes.root}
			onClick={onClick}
		>
      Redeem License
		</Button>
	);
};

export default RedeemLicenseButton;
