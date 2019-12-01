import React, { useEffect } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { FETCH_CHATS } from '../../gql/queries';
import { CHAT_SUBSCRIPTION } from '../../gql/subscriptions';

import Divider from '@material-ui/core/Divider'

export default function ChatList({ handleOpenChat, user }) {
    const { data, loading, subscribeToMore } = useQuery(FETCH_CHATS, {
        variables: {
            userId: user.id,
            limit: 20
        },
        pollInterval: 1000
    });

    console.log(data && data)

    useEffect(() => {
        subscribeToMore({
            document: CHAT_SUBSCRIPTION,
            variables: { userId: user.id },
            updateQuery: (prev, { subscriptionData }) => {
                if (!subscriptionData.data) return prev;

                const newChat = subscriptionData.data.newChat;
                handleOpenChat(newChat);
                return {
                    chats: [...prev.chats, newChat]
                };
            }
        });

    }, [subscribeToMore, user.id, handleOpenChat]);

    if (loading) return <p>Loading....</p>;

    if (!loading)
        return (
            <>
                <div
                    xs={2}
                    style={{ background: '#ffd10d', padding: '15px', height: '100vh' }}
                >
                    <ul style={{ padding: 0 }}>

                        {data.chats.map(chat => (
                            <div key={chat.id}>
                                <li style={{ listStyle: 'none', padding: '15px' }} onClick={() => handleOpenChat(chat)}>
                                    <div>{chat.users[0].alias}</div>
                                    <p>{chat.messages[0] ? chat.messages[0].body : null}</p>
                                </li>
                                <Divider />
                            </div>
                        ))}

                    </ul>
                </div>
            </>
        );
}
