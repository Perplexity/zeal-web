import React from "react";
import {
	FormControl,
	InputLabel,
	makeStyles,
	MenuItem,
	Select,
} from "@material-ui/core";

const useStyles = makeStyles(() => ({
	formControl: {
		minWidth: "100%",
	},
}));

type Props = {
  label: string;
  value: string;
  options: string[];
  onChange?: (event: React.ChangeEvent<{ value: string; }>) => void
}

const Selector = ({label, value, options, onChange}: Props): JSX.Element => {
	const classes = useStyles();
	return (
		<FormControl variant="outlined" className={classes.formControl}>
			<InputLabel>{label}</InputLabel>
			<Select value={value} label={label} onChange={onChange}>
				{options.map(
					(option) => {
						return <MenuItem key={option} value={option}>{option}</MenuItem>;
					}
				)}
			</Select>
		</FormControl>
	);
};

export default Selector;
