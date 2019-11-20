import React, { useEffect } from 'react';
import { TextField } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import { useQuery } from '@apollo/react-hooks';
import { FETCH_MESSAGES } from '../../gql/queries';
import { MESSAGE_SUBSCRIPTION } from '../../gql/subscriptions';
import moment from 'moment';

function Chat({
  user,
  currentlyOpenChats,
  values,
  handleChange,
  handleSubmit
}) {
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

  const isDisabled = values.trim() === '';

  if (loading) return <p>Loading...</p>;

  if (!loading)
    return (
      <>
        {currentlyOpenChats.id !== '' && (
          <>
            <div
              style={{
                padding: '15px',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                fontSize: '12px',
                fontWeight: 500,
                height: '5vh',
                borderBottom: '1px solid #eee'
              }}
            >
              {currentlyOpenChats.title}
            </div>
            <ul
              style={{
                margin: 0,
                padding: '0 15px',
                height: '87vh',
                overflowY: 'scroll'
              }}
            >
              {data.messages.map((message, index) => (
                <li
                  style={
                    message.sender.id === user.id
                      ? {
                          listStyle: 'none',
                          maxWidth: '200px',
                          margin: '15px 0 5px auto'
                        }
                      : {
                          listStyle: 'none',
                          maxWidth: '200px',
                          margin: '15px 0 5px'
                        }
                  }
                  key={index}
                >
                  <p
                    style={
                      message.sender.id === user.id
                        ? {
                            backgroundColor: '#ffd10d',
                            maxWidth: '500px',
                            borderRadius: '10px 10px 0 10px',
                            padding: 10,
                            margin: 0
                          }
                        : {
                            backgroundColor: '#ccc',
                            maxWidth: '500px',
                            borderRadius: '10px 10px 10px 0',
                            padding: 10,
                            margin: 0
                          }
                    }
                  >
                    {message.body}
                  </p>
                  <span
                    style={{
                      color: '#8e8e8e',
                      textTransform: 'uppercase',
                      fontSize: '10px'
                    }}
                  >
                    {moment(message.createdAt).fromNow()}
                  </span>
                </li>
              ))}
            </ul>
            <div
              style={{
                borderTop: '1px solid #eee',
                padding: '10px',
                height: '8vh',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <TextField
                onChange={handleChange}
                value={values}
                variant='outlined'
                style={{ width: '85%' }}
              />
              <Button
                disabled={isDisabled}
                style={{ color: '#000' }}
                onClick={handleSubmit}
              >
                Send
              </Button>
            </div>
          </>
        )}
      </>
    );
}

export default Chat;
