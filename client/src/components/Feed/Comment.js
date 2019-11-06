import React from 'react'
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { makeStyles } from '@material-ui/core/styles';
import red from '@material-ui/core/colors/red';
import moment from 'moment';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

import DeleteButton from './DeleteButton';

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

export default function Comment({ postId, user, comment }) {
    const classes = useStyles();

    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleMenu = event => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <Card>
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
                                    user.alias === comment.alias && (
                                        <DeleteButton
                                            text='Delete'
                                            commentId={comment.id}
                                            postId={postId}
                                        />
                                    )}
                            </MenuItem>
                        </Menu>
                    </>
                }
                title={comment.alias}
                subheader={moment(comment.createdAt).fromNow()}
            />
            <CardContent>
                <Typography component='p'>{comment.body}</Typography>
            </CardContent>
        </Card>
    )
}