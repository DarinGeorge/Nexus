import React, { useContext, useState } from 'react';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { AuthContext } from '../utils/context/auth';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { FETCH_USER, FETCH_CHATS } from '../gql/queries';
import { CREATE_MESSAGE } from '../gql/mutations';

export default function Messages() {
  const { user } = useContext(AuthContext);

  const { data, loading } = useQuery(FETCH_CHATS, {
    variables: {
      userId: user.id,
      limit: 10
    }
  });

  const [currentlyOpenChats, setCurrentlyOpenChats] = useState('');
  const [values, setValues] = useState('');

  const [createMessage] = useMutation(CREATE_MESSAGE, {
    variables: {
      chatId: currentlyOpenChats,
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
          <Grid item xs={3}>
            <h1>Conversations</h1>

            {data.chats.map(chat => (
              <ul key={chat.id}>
                <li>
                  <button onClick={() => setCurrentlyOpenChats(chat.id)}>
                    {chat.title}
                  </button>
                </li>
              </ul>
            ))}
          </Grid>

          <Grid item xs={9}>
            {data.chats.map(chat => (
              <div key={chat.id}>
                {currentlyOpenChats.includes(chat.id) && (
                  <>
                    <h1>{chat.title}</h1>
                    <ul style={{ margin: 0, padding: 0 }}>
                      {chat.messages.map(message => (
                        <li
                          key={message.id}
                          style={{
                            listStyle: 'none',
                            backgroundColor: '#ccc',
                            maxWidth: '200px',
                            margin: '15px 0'
                          }}
                        >
                          {message.body}
                        </li>
                      ))}
                    </ul>
                    <TextField
                      onChange={handleChange}
                      value={values}
                      variant='outlined'
                    />
                    <Button
                      variant='contained'
                      color='primary'
                      onClick={handleSubmit}
                    >
                      Send
                    </Button>
                  </>
                )}
              </div>
            ))}
          </Grid>
        </Grid>
      </>
    );
}
