import React, { useEffect } from 'react';
import { TextField } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { MESSAGE_SUBSCRIPTION } from '../../gql/subscriptions';
import moment from 'moment';

function Chat({
  user,
  currentlyOpenChats,
  values,
  handleChange,
  handleSubmit,
  submitChat,
  handleKeyUp,
  data,
  loading,
  subscribeToMore
}) {

  const isDisabled = values.trim() === '';

  useEffect(() => {
    const unsubscribe = subscribeToMore({
      document: MESSAGE_SUBSCRIPTION,
      variables: { chatId: currentlyOpenChats.id },
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev;
        const newMessage = subscriptionData.data.newMessage;
        if (prev.messages.find(message => message.id === newMessage.id)) {
          console.log('message found! no message added.')
          return prev;
        } else {
          console.log('message not found:', newMessage)
          return {
            messages: [...prev.messages, newMessage]
          }
        }
      }
    });

    return () => { unsubscribe() }

  }, [subscribeToMore, currentlyOpenChats.id]);

  if (loading) return <p>Loading...</p>;

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
              overflowY: 'scroll',
              display: 'flex',
              flexFlow: 'column',
            }}
          >
            {currentlyOpenChats.new === false ? data.messages.map((message, index) => (
              <div
                style={
                  message.sender.id === user.id
                    ? {
                      listStyle: 'none',
                      marginTop: '15px',
                      display: 'flex',
                      flexFlow: 'column',
                      justifyContent: 'center',
                      alignSelf: 'flex-end',
                      maxWidth: 250
                    }
                    : {
                      listStyle: 'none',
                      marginTop: '15px',
                      display: 'flex',
                      flexFlow: 'column',
                      justifyContent: 'center',
                      alignSelf: 'flex-start',
                      maxWidth: 250
                    }
                }
                key={index}
              >
                <Typography
                  variant="body2" gutterBottom
                  style={
                    message.sender.id === user.id
                      ? {
                        backgroundColor: '#ffd10d',
                        borderRadius: '10px 10px 0 10px',
                        padding: 10,
                        width: 'fit-content',
                        wordBreak: 'break-all',
                        whiteSpace: 'normal'
                      }
                      : {
                        backgroundColor: '#ccc',
                        borderRadius: '10px 10px 10px 0',
                        padding: 10,
                        width: 'fit-content',
                        wordBreak: 'break-all',
                        whiteSpace: 'normal'
                      }
                  }
                >
                  {message.body}
                </Typography>
                <span
                  style={{
                    color: '#8e8e8e',
                    textTransform: 'uppercase',
                    fontSize: '10px'
                  }}
                >
                  {moment(message.createdAt).fromNow()}
                </span>
              </div>
            )) : (
                <div>Write your message below to begin your conversation.</div>
              )}
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
              onKeyUp={handleKeyUp}
            />
            <Button
              disabled={isDisabled}
              style={{ color: '#000' }}
              onClick={currentlyOpenChats.new === true ? submitChat : handleSubmit}

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
