import React, { useEffect } from 'react';
import { useSubscription, useMutation } from '@apollo/react-hooks';
import {
  CHAT_SUBSCRIPTION,
  MESSAGE_SUBSCRIPTION
} from '../../gql/subscriptions';

import Divider from '@material-ui/core/Divider';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import Typography from '@material-ui/core/Typography';
import gql from 'graphql-tag';

export default function ChatList({
  data,
  loading,
  subscribeToMore,
  handleOpenChat,
  user
}) {
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

    return () => {
      unsubscribe();
    };
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
            <ChatLink
              key={chat.id}
              handleOpenChat={handleOpenChat}
              chat={chat}
              user={user}
            />
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
  });
  const message = data && data.newMessage;

  const [pushNotification] = useMutation(PUSH_NOTIFICATION, {
    variables: {
      label: message && message.body,
      user: message && message.sender.alias
    }
  });

  useEffect(() => {
    if (message && message.chat === chat.id) {
      message.sender.id !== user.id && pushNotification();
    }
  }, [message, pushNotification, chat.id, user.id]);

  return (
    <>
      <div>
        <li
          style={{ listStyle: 'none', padding: '15px' }}
          onClick={() => handleOpenChat(chat)}
        >
          <div>{chat.users[1].alias}</div>
          <Typography noWrap>
            {message ? (
              message.sender.id !== user.id ? (
                <>
                  <span style={{ fontWeight: 700 }}>
                    <FiberManualRecordIcon
                      style={{ fontSize: '10px' }}
                      fontSize='inherit'
                      color='success'
                    />
                  </span>{' '}
                  <span>{message.body}</span>
                </>
              ) : (
                <span>{message.body}</span>
              )
            ) : chat.messages[0] ? (
              chat.messages[0].body
            ) : (
              'No messages.'
            )}
          </Typography>
        </li>
        <Divider />
      </div>
    </>
  );
};

const PUSH_NOTIFICATION = gql`
  mutation pushNotification($label: String!, $user: String!) {
    pushNotification(label: $label, user: $user) {
      label
      user
    }
  }
`;
