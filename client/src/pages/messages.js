import React, { useContext, useState } from 'react';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { AuthContext } from '../utils/context/auth';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { FETCH_USER, FETCH_CHATS } from '../gql/queries';
import { CREATE_MESSAGE } from '../gql/mutations';
import Chat from '../components/Messages/Chat';

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
          <Grid item xs={3}>
            <h1>Conversations</h1>

            {data.chats.map((chat, index) => (
              <ul key={index}>
                <li>
                  <button
                    onClick={() =>
                      setCurrentlyOpenChats({ id: chat.id, title: chat.title })
                    }
                  >
                    {chat.title}
                  </button>
                </li>
              </ul>
            ))}
          </Grid>

          <Grid item xs={9}>
            <Chat
              handleChange={handleChange}
              handleSubmit={handleSubmit}
              values={values}
              currentlyOpenChats={currentlyOpenChats}
            />
          </Grid>
        </Grid>
      </>
    );
}
