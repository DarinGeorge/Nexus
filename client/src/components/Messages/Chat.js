import React, { useEffect } from 'react';
import { TextField } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import { useQuery, useSubscription } from '@apollo/react-hooks';
import { FETCH_MESSAGES } from '../../gql/queries';
import { MESSAGE_SUBSCRIPTION } from '../../gql/subscriptions';

function Chat({ currentlyOpenChats, values, handleChange, handleSubmit }) {
  const { data, loading, subscribeToMore } = useQuery(FETCH_MESSAGES, {
    variables: {
      chatId: currentlyOpenChats.id
    }
  });

  useEffect(() => {
    subscribeToMore({
      document: MESSAGE_SUBSCRIPTION,
      variables: { chatId: currentlyOpenChats.id },
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev;
        const newMessage = subscriptionData.data.newMessage;

        return {
          messages: [...prev.messages, newMessage]
        };
      }
    });
  }, [subscribeToMore, currentlyOpenChats.id]);

  if (loading) return <p>...Loading</p>;

  if (!loading)
    return (
      <>
        {currentlyOpenChats.id !== '' && (
          <>
            <h1>{currentlyOpenChats.title}</h1>
            <ul style={{ margin: 0, padding: 0 }}>
              {data.messages.map((message, index) => (
                <li
                  key={index}
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
            <Button variant='contained' color='primary' onClick={handleSubmit}>
              Send
            </Button>
          </>
        )}
      </>
    );
}

export default Chat;
