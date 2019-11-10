import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import { makeStyles } from '@material-ui/core/styles';
import { useLocation } from 'react-router-dom';
import red from '@material-ui/core/colors/red';
import moment from 'moment';

import { FETCH_USER } from '../gql/queries';
import { Avatar, Link } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
    avatar: {
        backgroundColor: red[500],
        width: 150,
        height: 150,
    },
    radial: {
        padding: theme.spacing(1),
        border: '1px solid #ccc',
        borderRadius: '100%',
        position: 'absolute',
        top: '30%'
    }
}));

export default function Profile() {
    const classes = useStyles();

    // use 'userId' passed from <Link/> component state to get the user
    let location = useLocation();
    const userId = location.state.linkUserId

    const { data } = useQuery(FETCH_USER, {
        variables: {
            userId
        }
    });

    let profileMarkup;
    if (!data) {
        profileMarkup = <p>Loading...</p>;
    } else {
        const { id, alias, createdAt, email } = data.user;
        profileMarkup = (
            <div>
                <div className={classes.radial}>
                    <Avatar className={classes.avatar}>
                        B
                    </Avatar>
                </div>
                <h1> This is {alias}'s profile.</h1>
                <p>ID: {id}</p>
                <p>Email: {email}</p>
                <p>Joined Nexus: {moment(createdAt).fromNow()}</p>
            </div>
        )
    }
    return profileMarkup;
}