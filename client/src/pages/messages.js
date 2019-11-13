import React, { useContext } from 'react'
import Grid from '@material-ui/core/Grid'
import { AuthContext } from '../utils/context/auth'

export default function Messages() {
    const { user } = useContext(AuthContext)

    return (
        <>
            <Grid container>
                <Grid item xs={2}>
                    <>
                        <h1>You are logged in as {user.alias}</h1>
                    </>
                </Grid>
                <Grid item container xs={10}>
                    <Grid item xs={10}>
                        Conversation
                    </Grid>
                    <Grid item xs={2}>
                        User Info
                    </Grid>
                </Grid>
            </Grid>
        </>
    )
}