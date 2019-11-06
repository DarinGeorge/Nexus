import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import { useMutation } from '@apollo/react-hooks';
import Button from '@material-ui/core/Button';

import { DELETE_POST, DELETE_COMMENT } from '../../gql/mutations';
import { FETCH_POSTS } from '../../gql/queries';

const useStyles = makeStyles(theme => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3)
  },
  danger: {
    color: '#ff0000'
  }
}));

function DeleteButton({ postId, commentId, callback, text }) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const mutation = commentId ? DELETE_COMMENT : DELETE_POST;

  const [deletePostOrMutation] = useMutation(mutation, {
    update(proxy) {
      if (!commentId) {
        setOpen(false);
        const data = proxy.readQuery({ query: FETCH_POSTS });

        if (data.posts) {
          data.posts = data.posts.filter(post => post.id !== postId);
          proxy.writeQuery({ query: FETCH_POSTS, data });
        } else {
          if (callback) callback()
        }
      }
      if (callback) callback();
    },
    variables: {
      postId,
      commentId
    }
  });
  return (
    <div>
      {text ? (
        <div className={classes.danger} onClick={handleOpen}>{text}</div>
      ) : (
          <IconButton aria-label='settings' onClick={handleOpen}>
            <DeleteIcon />
          </IconButton>
        )}

      <Modal
        aria-labelledby='transition-modal-title'
        aria-describedby='transition-modal-description'
        className={classes.modal}
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500
        }}
      >
        <Fade in={open}>
          <div className={classes.paper}>
            <h2 id='transition-modal-title'>Delete {commentId ? 'Comment' : 'Post'} </h2>
            <p id='transition-modal-description'>
              Are you sure you want to delete this {commentId ? 'comment' : 'post'}?
            </p>
            <div style={{ display: 'flex' }}>
              <Button onClick={deletePostOrMutation}>YES</Button>
              <Button onClick={handleClose}>NO</Button>
            </div>
          </div>
        </Fade>
      </Modal>
    </div>
  );
}

export default DeleteButton;
