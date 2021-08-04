import {
  FormControl,
  InputLabel,
  makeStyles,
  MenuItem,
  Select,
} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
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

const Selector = ({label, value, options, onChange}: Props) => {
  const classes = useStyles();
  return (
    <FormControl variant="outlined" className={classes.formControl}>
      <InputLabel>{label}</InputLabel>
      <Select value={value} label={label} onChange={onChange}>
        {options.map(
          (option) => {
            return <MenuItem value={option}>{option}</MenuItem>;
          }
        )}
      </Select>
    </FormControl>
  );
};

export default Selector;
