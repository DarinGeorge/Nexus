import React, { useEffect } from 'react';
import { useSubscription } from '@apollo/react-hooks';
import { CHAT_SUBSCRIPTION, MESSAGE_SUBSCRIPTION } from '../../gql/subscriptions';

import Divider from '@material-ui/core/Divider'

export default function ChatList({ data, loading, subscribeToMore, handleOpenChat, user }) {

    useEffect(() => {

        const unsubscribe = subscribeToMore({
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

        return () => { unsubscribe() }

    }, [subscribeToMore, user.id, handleOpenChat]);

    if (loading) return <p>Loading....</p>;

    return (
        <>
            <div
                xs={2}
                style={{ background: '#ffd10d', padding: '15px', height: '100vh' }}
            >
                <ul style={{ padding: 0 }}>
                    {data.chats.map(chat => (
                        <ChatLink key={chat.id} handleOpenChat={handleOpenChat} chat={chat} user={user} />
                    ))}
                </ul>
            </div>
        </>
    );
}

const ChatLink = ({ handleOpenChat, chat, user }) => {
    const { data } = useSubscription(MESSAGE_SUBSCRIPTION, {
        variables: {
            chatId: chat.id
        },
        shouldResubscribe: true
    })
    const message = data && data.newMessage

    return (
        <>
            <div>
                <li style={{ listStyle: 'none', padding: '15px' }} onClick={() => handleOpenChat(chat)}>
                    <div>{chat.users[0].alias}</div>
                    <div>{message ? message.sender.id !== user.id ? <><span style={{ fontWeight: 700 }}>New:</span> <span>{message.body}</span></> : <span>{message.body}</span> : chat.messages[0] ? chat.messages[0].body : 'No messages.'}</div>
                </li>
                <Divider />
            </div>
        </>
    )
}
