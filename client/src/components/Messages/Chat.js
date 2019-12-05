import React, { useEffect } from 'react';
import { TextField } from '@material-ui/core';
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
              overflowY: 'scroll'
            }}
          >
            {currentlyOpenChats.new === false ? data.messages.map((message, index) => (
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
