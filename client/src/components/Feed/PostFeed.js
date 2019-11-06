import { makeStyles } from '@material-ui/core/styles';
import { red } from '@material-ui/core/colors';
import React, { useContext, useState } from 'react';
import clsx from 'clsx';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import ChatBubbleIcon from '@material-ui/icons/ChatBubble';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../utils/context/auth';
import DeleteButton from './DeleteButton';
import { useHistory } from 'react-router-dom';

export const useStyles = makeStyles(theme => ({
  postCard: {
    paddingTop: theme.spacing(3)
  },
  meta: {
    borderTop: '5px solid #ffd10d'
  },
  media: {
    height: 0,
    paddingTop: '56.25%' // 16:9
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest
    })
  },
  expandOpen: {
    transform: 'rotate(180deg)'
  },
  avatar: {
    backgroundColor: red[500]
  }
}));

export default function PostFeed({ data }) {
  const classes = useStyles();
  const history = useHistory();
  const { user } = useContext(AuthContext);
  const [expanded, setExpanded] = useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  function deletePostCallback() {
    history.push('/feed');
  }

  return (
    <>
      {data.posts.map((post, index) => (
        <div key={index} className={classes.postCard}>
          <Card className={classes.card}>
            <Link to={`/feed/${post.id}`}>
              <CardMedia
                className={classes.media}
                image='https://source.unsplash.com/random'
              />
            </Link>

            <CardHeader
              className={classes.meta}
              avatar={
                <Avatar aria-label='recipe' className={classes.avatar}>
                  R
                </Avatar>
              }
              action={
                user &&
                user.alias === post.alias && (
                  <DeleteButton
                    postId={post.id}
                    callback={deletePostCallback}
                  />
                )
              }
              title={post.alias}
              subheader={moment(post.createdAt).fromNow()}
            />
            <CardContent>
              <Typography variant='body2' color='textSecondary' component='p'>
                {post.body}
              </Typography>
            </CardContent>
            <CardActions disableSpacing>
              <Link to={`/feed/${post.id}`}>
                <IconButton aria-label='add to favorites'>
                  <ChatBubbleIcon />
                </IconButton>
              </Link>
              <span>{post.commentCount}</span>
              <IconButton
                className={clsx(classes.expand, {
                  [classes.expandOpen]: expanded
                })}
                onClick={handleExpandClick}
                aria-expanded={expanded}
                aria-label='show more'
              >
                <ExpandMoreIcon />
              </IconButton>
            </CardActions>
            <Collapse in={expanded} timeout='auto' unmountOnExit>
              <CardContent>
                <Typography paragraph>Method:</Typography>
                <Typography paragraph>
                  Heat 1/2 cup of the broth in a pot until simmering, add
                  saffron and set aside for 10 minutes.
                </Typography>
                <Typography paragraph>
                  Heat oil in a (14- to 16-inch) paella pan or a large, deep
                  skillet over medium-high heat. Add chicken, shrimp and
                  chorizo, and cook, stirring occasionally until lightly
                  browned, 6 to 8 minutes. Transfer shrimp to a large plate and
                  set aside, leaving chicken and chorizo in the pan. Add
                  pimentón, bay leaves, garlic, tomatoes, onion, salt and
                  pepper, and cook, stirring often until thickened and fragrant,
                  about 10 minutes. Add saffron broth and remaining 4 1/2 cups
                  chicken broth; bring to a boil.
                </Typography>
                <Typography paragraph>
                  Add rice and stir very gently to distribute. Top with
                  artichokes and peppers, and cook without stirring, until most
                  of the liquid is absorbed, 15 to 18 minutes. Reduce heat to
                  medium-low, add reserved shrimp and mussels, tucking them down
                  into the rice, and cook again without stirring, until mussels
                  have opened and rice is just tender, 5 to 7 minutes more.
                  (Discard any mussels that don’t open.)
                </Typography>
                <Typography>
                  Set aside off of the heat to let rest for 10 minutes, and then
                  serve.
                </Typography>
              </CardContent>
            </Collapse>
          </Card>
        </div>
      ))}
    </>
  );
}
