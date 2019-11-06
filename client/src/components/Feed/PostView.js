import React, { useContext, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Collapse from '@material-ui/core/Collapse';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import red from '@material-ui/core/colors/red';
import ChatBubbleIcon from '@material-ui/icons/Favorite';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import classnames from 'classnames';
import Container from '@material-ui/core/Container';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import TextField from '@material-ui/core/TextField'
import { useQuery, useMutation } from '@apollo/react-hooks';
import moment from 'moment';
import { useParams, useHistory } from 'react-router-dom';

import { FETCH_POST } from '../../gql/queries';
import { AuthContext } from '../../utils/context/auth';
import DeleteButton from './DeleteButton';
import { CREATE_COMMENT } from '../../gql/mutations';
import Comment from './Comment'

const useStyles = makeStyles(theme => ({
  // card: {
  //   maxWidth: 400
  // },
  media: {
    height: 0,
    paddingTop: '56.25%' // 16:9
  },
  actions: {
    display: 'flex'
  },
  expand: {
    transform: 'rotate(0deg)',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest
    }),
    marginLeft: 'auto',
    [theme.breakpoints.up('sm')]: {
      marginRight: -8
    }
  },
  expandOpen: {
    transform: 'rotate(180deg)'
  },
  avatar: {
    backgroundColor: red[500]
  }
}));

function PostView() {
  const classes = useStyles();
  const { user } = useContext(AuthContext);
  const { postId } = useParams();
  const history = useHistory();

  const [expanded, setExpanded] = useState(false);
  const [comment, setComment] = useState('');
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenu = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const { data } = useQuery(FETCH_POST, {
    variables: {
      postId
    }
  });

  const [submitComment] = useMutation(CREATE_COMMENT, {
    update() {
      setComment('');
    },
    variables: {
      postId,
      body: comment
    }
  })

  function deletePostCallback() {
    history.push('/feed');
  }

  let postMarkup;
  if (!data) {
    postMarkup = <p>Loading...</p>;
  } else {
    const { id, body, createdAt, alias, comments, commentCount } = data.post;
    postMarkup = (
      <>
        <Container maxWidth='sm'>

          <Card className={classes.card}>
            <CardHeader
              avatar={
                <Avatar aria-label='Recipe' className={classes.avatar}>
                  R
            </Avatar>
              }
              action={
                <>
                  <IconButton onClick={handleMenu}>
                    <MoreVertIcon />
                  </IconButton>
                  <Menu
                    id="simple-menu"
                    anchorEl={anchorEl}
                    keepMounted
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                  >
                    <MenuItem onClick={handleClose}>Report</MenuItem>
                    <hr />
                    <MenuItem onClick={handleClose}>
                      {user &&
                        user.alias === alias && (
                          <DeleteButton
                            text='Delete'
                            postId={id}
                            callback={deletePostCallback}
                          />
                        )}
                    </MenuItem>
                  </Menu>
                </>
              }
              title={alias}
              subheader={moment(createdAt).fromNow()}
            />
            <CardMedia
              className={classes.media}
              image='https://source.unsplash.com/random'
              title='Random'
            />
            <CardContent>
              <Typography component='p'>{body}</Typography>
            </CardContent>
            <CardActions className={classes.actions}>
              <IconButton
                onClick={() => console.log('comment on post')}
                aria-label='Add to favorites'
              >
                <ChatBubbleIcon />
                <span>{commentCount}</span>
              </IconButton>
              {user && user.alias === alias && (
                <DeleteButton postId={id} callback={deletePostCallback} />
              )}
              <IconButton
                className={classnames(classes.expand, {
                  [classes.expandOpen]: expanded
                })}
                onClick={handleExpandClick}
                aria-expanded={expanded}
                aria-label='Show more'
              >
                <ExpandMoreIcon />
              </IconButton>
            </CardActions>
            <Collapse in={expanded} timeout='auto' unmountOnExit>
              <CardContent>
                <Typography paragraph>Method:</Typography>
                <Typography paragraph>
                  Heat 1/2 cup of the broth in a pot until simmering, add saffron
                  and set aside for 10 minutes.
            </Typography>
                <Typography paragraph>
                  Heat oil in a (14- to 16-inch) paella pan or a large, deep skillet
                  over medium-high heat. Add chicken, shrimp and chorizo, and cook,
                  stirring occasionally until lightly browned, 6 to 8 minutes.
                  Transfer shrimp to a large plate and set aside, leaving chicken
                  and chorizo in the pan. Add pimentón, bay leaves, garlic,
                  tomatoes, onion, salt and pepper, and cook, stirring often until
                  thickened and fragrant, about 10 minutes. Add saffron broth and
                  remaining 4 1/2 cups chicken broth; bring to a boil.
            </Typography>
                <Typography paragraph>
                  Add rice and stir very gently to distribute. Top with artichokes
                  and peppers, and cook without stirring, until most of the liquid
                  is absorbed, 15 to 18 minutes. Reduce heat to medium-low, add
                  reserved shrimp and mussels, tucking them down into the rice, and
                  cook again without stirring, until mussels have opened and rice is
                  just tender, 5 to 7 minutes more. (Discard any mussels that don’t
                  open.)
            </Typography>
                <Typography>
                  Set aside off of the heat to let rest for 10 minutes, and then
                  serve.
            </Typography>
              </CardContent>
            </Collapse>
          </Card>
          {user && (
            <>
              <TextField
                variant='outlined'
                placeholder='Leave a comment..'
                name='comment'
                value={comment}
                onChange={event => setComment(event.target.value)}

              />
              <Button type='submit' color='primary' variant='contained' disabled={comment.trim() === ''} onClick={submitComment}>Post Comment</Button>
            </>
          )}
          {comments.map(comment => (
            <Comment key={comment.id} postId={id} user={user} comment={comment} />
          ))}

        </Container>
      </>
    );
  }
  return postMarkup;
}

export default PostView;
