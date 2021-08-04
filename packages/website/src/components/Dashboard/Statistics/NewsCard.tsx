import {
  Avatar,
  Card,
  CardContent,
  Grid,
  Typography,
  colors,
  makeStyles,
} from '@material-ui/core';
import { BookOpen } from 'react-feather';

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100%',
  },
  avatar: {
    height: 56,
    width: 56,
    backgroundColor: colors.blue[800],
  },
  differenceIcon: {
    color: colors.red[900],
  },
  differenceValue: {
    color: colors.red[900],
    marginRight: theme.spacing(1),
  },
}));

const NewsCard = () => {
  const classes = useStyles();

  return (
    <Card>
      <CardContent>
        <Grid container justify="space-between" spacing={3}>
          <Grid item>
            <Typography
              align="center"
              variant="subtitle1"
              color="textSecondary"
            >
              Nothing to show.
            </Typography>
          </Grid>
          <Grid item>
            <Avatar className={classes.avatar}>
              <BookOpen />
            </Avatar>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default NewsCard;
