import React, { useContext, useEffect } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { FETCH_CHATS } from '../../gql/queries';
import { AuthContext } from '../../utils/context/auth';

function Conversations() {
  const { user } = useContext(AuthContext);
  const { data, loading } = useQuery(FETCH_CHATS, {
    variables: {
      userId: user.id,
      limit: 11
    }
  });

  if (loading) return <p>Loading...</p>;

  if (!loading)
    return (
      <>
        <h1>Conversations</h1>

        {data.chats.map(chat => (
          <ul key={chat.id}>
            <li>
              <button>{chat.title}</button>
            </li>
          </ul>
        ))}
      </>
    );
}

export default Conversations;
