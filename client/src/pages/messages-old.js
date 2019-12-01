import React, { useContext, useState, useEffect, useCallback } from 'react';
import Grid from '@material-ui/core/Grid';
import { AuthContext } from '../utils/context/auth';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { FETCH_CHATS } from '../gql/queries';
import { CREATE_MESSAGE } from '../gql/mutations';
import Chat from '../components/Messages/Chat';
import { Divider } from '@material-ui/core';
import ChatStarter from '../components/Messages/ChatStarter'
import { CHAT_SUBSCRIPTION } from '../gql/subscriptions';

export default function Messages() {
  const { user } = useContext(AuthContext);

  const { data, loading, subscribeToMore } = useQuery(FETCH_CHATS, {
    variables: {
      userId: user.id,
      limit: 20
    }
  });

  const [currentlyOpenChats, setCurrentlyOpenChats] = useState({
    id: '',
    title: ''
  });

  console.log(currentlyOpenChats)

  const [values, setValues] = useState('');

  useEffect(() => {
    subscribeToMore({
      document: CHAT_SUBSCRIPTION,
      variables: { userId: user.id },
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev;
        const newChat = subscriptionData.data.newChat;
        setCurrentlyOpenChats({ id: newChat.id, title: newChat.users.length > 2 ? newChat.title : newChat.users[0].alias })
        return {
          chats: [...prev.chats, newChat]
        };
      }
    });

  }, [subscribeToMore, user.id]);

  const [createMessage] = useMutation(CREATE_MESSAGE, {
    variables: {
      chatId: currentlyOpenChats.id,
      body: values
    }
  });

  const handleChange = e => {
    setValues(e.target.value);
  };

  const handleSubmit = () => {
    setValues('');
    createMessage();
  };

  const handleOpenChat = useCallback(chat => {
    console.log(chat)
    setCurrentlyOpenChats({ id: chat.id, title: chat.users.length > 2 ? chat.title : chat.users[0].alias });
  }, []);

  if (loading) return <p>Loading....</p>;

  if (!loading)
    return (
      <>
        <Grid container>
          <Grid
            item
            xs={2}
            style={{ background: '#ffd10d', padding: '15px', height: '100vh' }}
          >
            <div
              style={{
                textTransform: 'uppercase',
                letterSpacing: '1px',
                fontSize: '12px',
                fontWeight: 500,
                marginBottom: 20
              }}
            >
              Direct Messages
            </div>

            <ul style={{ margin: 0, padding: 0 }}>
              {data.chats.map((chat, index) => (
                <li key={index} style={{ listStyle: 'none', padding: 0 }}>
                  <div
                    style={{
                      background: 'transparent',
                      margin: '10px 0',
                      cursor: 'pointer',
                      textTransform: 'capitalize',
                      textAlign: 'left',
                      fontWeight: 700
                    }}

                    onClick={() =>
                      setCurrentlyOpenChats({
                        id: chat.id,
                        title: chat.users.length > 2 ? chat.title : chat.users[0].alias
                      })
                    }
                  >
                    <span>{chat.users.length > 2 ? chat.title : chat.users[0].alias}</span>
                    {chat.messages.length !== 0 ? <p style={{ fontWeight: 400 }}>{chat.messages.map(message => message.body)}</p> : <p style={{ fontWeight: 400 }}>No messages.</p>/*TODO: CHANGE THIS TO CALL A DELETE CHAT MUTATION*/}
                  </div>

                  <Divider />
                </li>
              ))}
            </ul>
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
                  currentlyOpenChats={currentlyOpenChats}
                />
              )}
          </Grid>

          <Grid item xs={3} style={{ borderLeft: '1px solid #eee' }}>
            <ChatStarter handleOpenChat={handleOpenChat} />
          </Grid>
        </Grid>
      </>
    );
}
