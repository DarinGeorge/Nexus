import React, { useEffect, useContext } from 'react'
import { useQuery } from '@apollo/react-hooks'
import { FETCH_USERS } from '../../gql/queries'
import { AuthContext } from '../../utils/context/auth'

import Button from '@material-ui/core/Button'

export default function ModalData({ handleOpenChat, closeUserModal, beginChat, mutationData }) {
    const { user } = useContext(AuthContext);

    const id = user.id; // Context user id or current logged in user id
    const { data: query, loading } = useQuery(FETCH_USERS);

    const users = query && query.users.filter(user => user.id !== id)


    useEffect(() => {
        const abortController = new AbortController();

        if (mutationData) {
            handleOpenChat(mutationData.startChat)
        }

        return () => {
            abortController.abort();
        }
    }, [mutationData, handleOpenChat]);

    const activateMutation = (id, alias) => {
        beginChat(id, alias);
        closeUserModal();
    }

    if (loading) return <p>Loading...Super Hard.</p>

    return (
        <>{users.map(user => (
            <div key={user.id}>
                <Button onClick={() => activateMutation(user.id, user.alias)}>{user.alias}</Button>
            </div>
        ))}</>
    )
}