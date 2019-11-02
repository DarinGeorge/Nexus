import { LoadArray } from '../../utils/loaders/feedLoader';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Skeleton from '@material-ui/lab/Skeleton';

import React from 'react';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3)
  },
  postCard: {
    paddingTop: theme.spacing(3)
  },
  meta: {
    borderTop: '5px solid #ffd10d'
  }
}));

function PostLoader() {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Grid container>
        <Grid item xs={8} width={210}>
          {LoadArray.map(load => (
            <div key={load.id} className={classes.postCard}>
              <Card className={classes.card}>
                <Skeleton variant='rect' width='100%' height={450} />
                <CardHeader
                  className={classes.meta}
                  avatar={<Skeleton variant='circle' width={40} height={40} />}
                  action={null}
                  title={<Skeleton height={6} width='80%' />}
                  subheader={<Skeleton height={6} width='40%' />}
                />
                <CardContent>
                  <Skeleton height={6} />
                  <Skeleton height={6} width='80%' />
                </CardContent>
              </Card>
            </div>
          ))}
        </Grid>
      </Grid>
    </div>
  );
}

export default PostLoader;
