import React, { useContext, useState, useCallback } from 'react';
import Grid from '@material-ui/core/Grid';
import { useMutation, useQuery } from '@apollo/react-hooks';

import { AuthContext } from '../utils/context/auth';
import { CREATE_MESSAGE, CREATE_CHAT } from '../gql/mutations';
import Chat from '../components/Messages/Chat';
import ChatStarter from '../components/Messages/ChatStarter'
import ChatList from '../components/Messages/ChatList';
import { FETCH_CHATS, FETCH_MESSAGES } from '../gql/queries';

export default function Messages() {
    const { user } = useContext(AuthContext);

    const [currentlyOpenChats, setCurrentlyOpenChats] = useState({
        id: '',
        title: '',
        new: false
    });

    const [values, setValues] = useState('');

    const [newChat, setNewChat] = useState({
        userId: '',
        alias: ''
    });

    const { data: chatsQuery, loading: chatsLoading, subscribeToMore: subscribeToChats } = useQuery(FETCH_CHATS, {
        variables: {
            userId: user.id,
            limit: 20
        }
    });

    const { data: messagesQuery, loading: messagesLoading, subscribeToMore: subscribeToMessages } = useQuery(FETCH_MESSAGES, {
        variables: {
            chatId: currentlyOpenChats.id
        }
    });

    const [createMessage] = useMutation(CREATE_MESSAGE, {
        variables: {
            chatId: currentlyOpenChats.id,
            body: values
        },
        onCompleted(data) {
            if (data) {
                setValues('');
                if (currentlyOpenChats.title.includes('New Message to')) {
                    const match = chatsQuery && chatsQuery.chats.find(chat => chat.id === data.createMessage.chat);
                    match && setCurrentlyOpenChats(prev => ({ ...prev, title: match.users.length > 2 ? match.title : match.users[0].alias, new: false }));
                }
            }
        }
    });

    const [startChat, { data: mutationData }] = useMutation(CREATE_CHAT, {
        variables: {
            sendTo: newChat.userId
        },
        onCompleted(data) {
            setNewChat({ userId: '' });
            setCurrentlyOpenChats({ id: data.startChat.id, title: data.startChat.users.length > 2 ? data.startChat.title : data.startChat.users[0].alias, new: false });
            createMessage();
            setValues('');
        }
    });

    const handleChange = e => {
        setValues(e.target.value);
    };

    const handleSubmit = () => {
        createMessage();
    };

    const handleKeyUp = (evt) => {
        if (evt.keyCode === 13) {
            handleSubmit();
        }
    };

    const beginChat = (id, alias) => {
        const match = chatsQuery && chatsQuery.chats.find(chat => chat.users[0].alias === alias);

        if (match) {
            setCurrentlyOpenChats({ id: match.id, title: `New Message to ${alias}`, new: false });
        } else {
            setNewChat({ userId: id, alias: alias });
            setCurrentlyOpenChats({ id: 'temp-chat', title: `New Message to ${alias}`, new: true });

        }
    }

    function submitChat() {
        startChat();
    }

    const handleOpenChat = useCallback(chat => {
        setCurrentlyOpenChats({ id: chat.id, title: chat.users.length > 2 ? chat.title : chat.users[0].alias, new: false });
        console.log('opening chat right away!')
    }, []);

    return (
        <>
            <Grid container>
                <Grid item xs={2}>
                    <ChatList
                        data={chatsQuery}
                        messageData={messagesQuery}
                        loading={chatsLoading}
                        subscribeToMore={subscribeToChats}
                        subscribeToMessages={subscribeToMessages}
                        values={values}
                        handleOpenChat={handleOpenChat}
                        user={user}
                        currentlyOpenChats={currentlyOpenChats}
                    />
                </Grid>

                <Grid item xs={7}>
                    {currentlyOpenChats.id === '' ? (
                        <h3
                            style={{
                                position: 'relative',
                                top: '40%',
                                left: '35%',
                                fontSize: '20px'
                            }}
                        >
                            Hi,{' '}
                            <span style={{ textTransform: 'capitalize' }}>
                                {user.alias}
                            </span>
                            . Select a Conversation to show it here.
                        </h3>
                    ) : (
                            <Chat
                                user={user}
                                handleChange={handleChange}
                                handleSubmit={handleSubmit}
                                values={values}
                                handleKeyUp={handleKeyUp}
                                currentlyOpenChats={currentlyOpenChats}
                                submitChat={submitChat}
                                data={messagesQuery}
                                loading={messagesLoading}
                                subscribeToMore={subscribeToMessages}
                            />
                        )}
                </Grid>

                <Grid item xs={3} style={{ borderLeft: '1px solid #eee' }}>
                    <ChatStarter
                        beginChat={beginChat}
                        mutationData={mutationData}
                        handleOpenChat={handleOpenChat}
                    />
                </Grid>
            </Grid>
        </>
    );
}
