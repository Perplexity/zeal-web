import {
  Box,
  Button,
  CircularProgress,
  Divider,
  FormControl,
  Grid,
  IconButton,
  InputBase,
  InputLabel,
  makeStyles,
  Paper,
  Typography,
} from '@material-ui/core';
import UploadIcon from '@material-ui/icons/CloudUpload';
import ClearIcon from '@material-ui/icons/Clear';
import { ChangeEventHandler } from 'react';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: '2px 4px',
    display: 'flex',
    alignItems: 'center',
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1,
  },
  iconButton: {
    padding: 10,
  },
  divider: {
    height: 28,
    margin: 4,
  },
}));

type Props = {
  label: string;
  file?: File;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  onClear?: () => void;
  loading?: boolean;
};

const Uploader = ({ label, file, onChange, onClear, loading }: Props) => {
  const classes = useStyles();

  return (
    <Grid item>
      <Typography gutterBottom>{label}</Typography>
      <Paper component="div" className={classes.root}>
        <IconButton
          component="label"
          className={classes.iconButton}
          aria-label="menu"
        >
          {loading ? (
            <CircularProgress size={32} />
          ) : (
            <>
              <input type="file" accept=".txt" hidden onChange={onChange} />
              <UploadIcon />
            </>
          )}
        </IconButton>
        <InputBase
          className={classes.input}
          placeholder="Select a file to upload..."
          value={file ? file.name : ''}
          readOnly
        />
        <IconButton className={classes.iconButton} onClick={onClear}>
          <ClearIcon />
        </IconButton>
      </Paper>
    </Grid>
  );
};

export default Uploader;
