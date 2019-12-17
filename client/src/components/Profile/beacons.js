import React from 'react';
import { FETCH_BEACONS_BY_USER } from '../../gql/queries';
import { useQuery } from '@apollo/react-hooks';
import moment from 'moment';

export default function Beacons({ id }) {
  const { data, loading } = useQuery(FETCH_BEACONS_BY_USER, {
    variables: {
      userId: id
    }
  });

  if (loading) return <p>Loading...</p>;

  return (
    <>
      <h2>Beacons</h2>
      <ul>
        {data &&
          data.beaconsByUser.map(beacon => (
            <li key={beacon.id}>
              <span style={{ fontWeight: 800, margin: 5 }}>{beacon.name}</span>
              <span>{moment(beacon.createdAt).fromNow()}</span>
            </li>
          ))}
      </ul>
    </>
  );
}
