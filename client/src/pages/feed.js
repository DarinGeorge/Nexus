import React, { useContext } from 'react';
import { useQuery, useSubscription } from '@apollo/react-hooks';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';

import { AuthContext } from '../utils/context/auth';
import PostFeed from '../components/Feed/PostFeed';
import PostLoader from '../components/Feed/PostLoader';
import PostCreator from '../components/Feed/PostCreator';
import { FETCH_POSTS, FETCH_CHATS } from '../gql/queries';
import { MESSAGE_SUBSCRIPTION } from '../gql/subscriptions';
import { Typography, Divider } from '@material-ui/core';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import { Link } from 'react-router-dom';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2)
  },
  networkBar: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),

    [theme.breakpoints.down('sm')]: {
      display: 'none'
    }
  },
  activityBar: {
    padding: theme.spacing(2),

    [theme.breakpoints.down('xs')]: {
      display: 'none'
    }
  }
}));

function Feed() {
  const classes = useStyles();
  const { user } = useContext(AuthContext);
  const { loading, data } = useQuery(FETCH_POSTS);
  const { loading: chatsLoading, data: chatsData } = useQuery(FETCH_CHATS, {
    variables: {
      userId: user.id
    }
  });
  const { data: msgSub } = useSubscription(MESSAGE_SUBSCRIPTION, {
    variables: {
      chatId: chatsData && chatsData.id
    },
    shouldResubscribe: true
  });
  const message = msgSub && msgSub.newMessage;

  console.log(chatsData && chatsData);

  if (!loading)
    return (
      <>
        <div className={classes.root}>
          <Grid container>
            {user && (
              <Grid item xs={12} sm={8} md={7} lg={6}>
                <PostCreator />
                <PostFeed loading={loading} data={data} />
              </Grid>
            )}

            <Grid
              className={classes.activityBar}
              item
              xs={false}
              sm={4}
              md={4}
              lg={3}
            >
              <Paper>ActivityBar</Paper>
            </Grid>

            <Grid
              className={classes.networkBar}
              item
              xs={false}
              sm={false}
              md={1}
              lg={3}
            >
              <Paper style={{ padding: '15px' }}>
                <h1>Conversations</h1>
                {chatsLoading ? (
                  <p>Loading...</p>
                ) : (
                  chatsData.chats.map(chat => (
                    <div key={chat.id}>
                      <Link
                        style={{ textDecoration: 'none', color: 'inherit' }}
                        to={`/messages/${chat.id}`}
                      >
                        <h3 style={{ margin: 0 }}>{chat.users[1].alias}</h3>
                        <Typography style={{ paddingBottom: '10px' }} noWrap>
                          {message ? (
                            message.sender.id !== user.id ? (
                              <>
                                <span style={{ fontWeight: 700 }}>
                                  <FiberManualRecordIcon
                                    style={{ fontSize: '10px' }}
                                    fontSize='inherit'
                                    color='success'
                                  />
                                </span>{' '}
                                <span>{message.body}</span>
                              </>
                            ) : (
                              <span>{message.body}</span>
                            )
                          ) : chat.messages[0] ? (
                            chat.messages[0].body
                          ) : (
                            'No messages.'
                          )}
                        </Typography>
                      </Link>
                      <Divider />
                    </div>
                  ))
                )}

                <hr />
                <div>Connections</div>
              </Paper>
            </Grid>
          </Grid>
        </div>
      </>
    );

  // Loading Skeleton
  if (loading)
    return (
      <>
        <PostLoader />
      </>
    );
}

export default Feed;
