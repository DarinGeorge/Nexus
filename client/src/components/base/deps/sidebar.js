import React, { useContext, useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import { Link } from 'react-router-dom';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import RadioButtonCheckedIcon from '@material-ui/icons/RadioButtonChecked';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import clsx from 'clsx';
import GroupIcon from '@material-ui/icons/Group';
import AppsSharpIcon from '@material-ui/icons/AppsSharp';
import ForumIcon from '@material-ui/icons/Forum';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import NotificationsIcon from '@material-ui/icons/Notifications';
import SettingsIcon from '@material-ui/icons/Settings';
import { withRouter } from 'react-router-dom';
import { AuthContext } from '../../../utils/context/auth';
import { useSubscription, useMutation } from '@apollo/react-hooks';
import { NOTIFICATION_SUBSCRIPTION } from '../../../gql/subscriptions';
import { LOGOUT_USER } from '../../../gql/mutations';

const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
  avatar: {
    margin: 10,
    width: 50,
    height: 50
  },
  menuButton: {
    marginRight: 36,
    marginLeft: 8
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    border: 'none',
    '&:hover': {
      transitionDelay: '.5s',
      width: drawerWidth,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen
      })
    }
  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  drawerClose: {
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    overflowX: 'hidden',
    width: theme.spacing(7) + 1,
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9) + 1
    }
  },
  aLinks: {
    width: '100%',
    display: 'flex',
    position: 'relative',
    boxSizing: 'border-box',
    textAlign: 'left',
    alignItems: 'center',
    justifyContent: 'flex-start',
    textDecoration: 'none',
    color: 'inherit'
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar
  },
  hide: {
    display: 'none'
  },
  desktopNav: {
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'flex'
    }
  },
  active: {
    color: '#ffd10d'
  },
  notificationCounter: {
    position: 'relative',
    left: '-45px',
    top: '-7px',
    background: '#ffd10d',
    padding: '1px 5px',
    fontSize: '10px',
    lineHeight: '14.5px',
    borderRadius: '100%'
  }
}));

function Sidebar(props) {
  const classes = useStyles();
  const { user, logout } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const [bundle, pushBundle] = useState([]);
  const [logoutUserStatusSet] = useMutation(LOGOUT_USER, {
    variables: {
      userId: user.id
    }
  });

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const isActive = value =>
    props.location.pathname === value ? classes.active : '';

  const { data: notifications } = useSubscription(NOTIFICATION_SUBSCRIPTION);

  useEffect(() => {
    if (notifications) {
      pushBundle([notifications]);
    }
  }, [notifications, pushBundle]);

  const handleLogout = () => {
    logoutUserStatusSet();
    logout();
  };

  return (
    <>
      <Drawer
        variant='permanent'
        className={clsx(classes.drawer, classes.desktopNav, {
          [classes.drawerOpen]: open,
          [classes.drawerClose]: !open
        })}
        classes={{
          paper: clsx(classes.drawer, {
            [classes.drawerOpen]: open,
            [classes.drawerClose]: !open
          })
        }}
        open={open}
      >
        <div>
          {open ? (
            <>
              <IconButton onClick={handleDrawerClose}>
                <FiberManualRecordIcon
                  style={{ fontSize: '10px' }}
                  fontSize='inherit'
                  color='error'
                />
              </IconButton>
            </>
          ) : (
            <IconButton onClick={handleDrawerOpen}>
              <FiberManualRecordIcon
                style={{ fontSize: '10px' }}
                fontSize='inherit'
              />
            </IconButton>
          )}
        </div>

        {user ? (
          <>
            <List>
              <Link to={`/creative/${user.alias}`}>
                <ListItem button className={classes.toolbar}>
                  <ListItemIcon
                    className={classes.userImg}
                    style={{ margin: '0 10px' }}
                  >
                    <Avatar
                      alt='Remy Sharp'
                      src='https://via.placeholder.com/40'
                      className={classes.avatar}
                    />
                  </ListItemIcon>
                  <ListItemText>{user.alias}</ListItemText>
                </ListItem>
              </Link>
            </List>
            <Divider />
            <List>
              <ListItem button>
                <ListItemIcon
                  color='inherit'
                  aria-label='open drawer'
                  edge='start'
                >
                  <AppsSharpIcon
                    className={clsx(classes.menuButton, isActive('/'))}
                  />
                </ListItemIcon>
                <ListItemText>Apps</ListItemText>
              </ListItem>
              <ListItem button>
                <ListItemIcon
                  color='inherit'
                  aria-label='open drawer'
                  edge='start'
                >
                  <NotificationsIcon
                    className={clsx(
                      classes.menuButton,
                      isActive('/notifications')
                    )}
                  ></NotificationsIcon>
                </ListItemIcon>
                <span
                  className={classes.notificationCounter}
                  style={{
                    fontWeight: 700,
                    display: bundle.length === 0 ? 'none' : 'block'
                  }}
                >
                  {bundle.length}
                </span>
                <ListItemText>Notifications</ListItemText>
              </ListItem>
              <Link
                to='/messages'
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <ListItem button>
                  <ListItemIcon
                    color='inherit'
                    aria-label='open drawer'
                    edge='start'
                  >
                    <ForumIcon
                      className={clsx(
                        classes.menuButton,
                        isActive('/messages')
                      )}
                    />
                  </ListItemIcon>
                  <ListItemText>Messages</ListItemText>
                </ListItem>
              </Link>
              <Link
                to='/beacons'
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <ListItem button>
                  <ListItemIcon
                    color='inherit'
                    aria-label='open drawer'
                    edge='start'
                  >
                    <RadioButtonCheckedIcon
                      className={clsx(classes.menuButton, isActive('/beacons'))}
                    ></RadioButtonCheckedIcon>
                  </ListItemIcon>

                  <ListItemText>Beacons</ListItemText>
                </ListItem>
              </Link>
              <ListItem button>
                <ListItemIcon
                  color='inherit'
                  aria-label='open drawer'
                  edge='start'
                >
                  <SettingsIcon
                    className={clsx(classes.menuButton, isActive('/settings'))}
                  />
                </ListItemIcon>
                <ListItemText>Settings</ListItemText>
              </ListItem>
              <ListItem button>
                <ListItemIcon
                  color='inherit'
                  aria-label='open drawer'
                  edge='start'
                  className={classes.menuButton}
                  onClick={handleLogout}
                >
                  <ExitToAppIcon />
                </ListItemIcon>
                <ListItemText>Log Out</ListItemText>
              </ListItem>
            </List>
          </>
        ) : (
          <>
            <List>
              <ListItem button>
                <Link to='/auth/register' className={classes.aLinks}>
                  <ListItemIcon
                    color='inherit'
                    aria-label='Sign Up'
                    edge='start'
                    className={classes.menuButton}
                  >
                    <GroupIcon />
                  </ListItemIcon>
                  <ListItemText>Sign Up</ListItemText>
                </Link>
              </ListItem>
              <ListItem button>
                <Link to='/auth/login' className={classes.aLinks}>
                  <ListItemIcon
                    color='inherit'
                    edge='start'
                    className={classes.menuButton}
                  >
                    <GroupIcon />
                  </ListItemIcon>
                  <ListItemText>Login</ListItemText>
                </Link>
              </ListItem>
            </List>
          </>
        )}
      </Drawer>
    </>
  );
}

export default withRouter(Sidebar);
