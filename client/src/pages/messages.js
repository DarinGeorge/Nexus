import React, { useContext, useState } from 'react';
import Grid from '@material-ui/core/Grid';
import { AuthContext } from '../utils/context/auth';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { FETCH_CHATS } from '../gql/queries';
import { CREATE_MESSAGE } from '../gql/mutations';
import Chat from '../components/Messages/Chat';
import { Divider } from '@material-ui/core';

export default function Messages() {
  const { user } = useContext(AuthContext);

  const { data, loading } = useQuery(FETCH_CHATS, {
    variables: {
      userId: user.id,
      limit: 10
    }
  });

  const [currentlyOpenChats, setCurrentlyOpenChats] = useState({
    id: '',
    title: ''
  });
  const [values, setValues] = useState('');

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
                  <button
                    style={{
                      outline: 'none',
                      background: 'transparent',
                      margin: '10px 0',
                      border: 'none'
                    }}
                    onClick={() =>
                      setCurrentlyOpenChats({
                        id: chat.id,
                        title: chat.title
                      })
                    }
                  >
                    {chat.title}
                  </button>
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
            Start Chat List
          </Grid>
        </Grid>
      </>
    );
}
