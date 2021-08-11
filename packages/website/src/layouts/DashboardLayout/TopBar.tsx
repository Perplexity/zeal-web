import clsx from "clsx";
import PropTypes from "prop-types";
import { AppBar, Box, Hidden, IconButton, Toolbar, makeStyles } from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";

const useStyles = makeStyles(() => ({
	root: {},
	avatar: {
		width: 60,
		height: 60
	}
}));
type Props = {
  className?: string;
  onMobileNavOpen: () => void;
};
const TopBar = ({ className, onMobileNavOpen, ...rest }: Props): JSX.Element => {
	const classes = useStyles();

	return (
		<AppBar className={clsx(classes.root, className)} elevation={0} {...rest}>
			<Toolbar>
				<Box flexGrow={1} />
				<Hidden lgUp>
					<IconButton color="inherit" onClick={onMobileNavOpen}>
						<MenuIcon />
					</IconButton>
				</Hidden>
			</Toolbar>
		</AppBar>
	);
};

TopBar.propTypes = {
	className: PropTypes.string,
	onMobileNavOpen: PropTypes.func
};

export default TopBar;
