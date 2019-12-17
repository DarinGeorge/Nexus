import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { FETCH_BEACONS } from '../gql/queries';
import { CREATE_BEACON } from '../gql/mutations';
import { Paper, Button } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import moment from 'moment';
import { Link } from 'react-router-dom';

export default function Beacons() {
  const { data, loading } = useQuery(FETCH_BEACONS);
  const [form, setFormOpen] = useState(false);
  const [values, setValues] = useState({
    name: '',
    description: '',
    location: '',
    date: '',
    time: ''
  });

  const [createBeacon] = useMutation(CREATE_BEACON, {
    variables: {
      name: values.name,
      description: values.description,
      location: values.location,
      date: values.date,
      time: values.time
    },
    update() {
      setValues({
        name: '',
        description: '',
        location: '',
        date: '',
        time: ''
      });
    }
  });

  console.log(values);

  const handleChange = e => {
    setValues({
      ...values,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = e => {
    createBeacon();
  };

  if (loading) return <p>Loading...</p>;

  return (
    <>
      <div style={{ margin: '0 auto' }}>
        <div>
          <h1>Beacons</h1>

          <div>
            <Button
              variant='contained'
              color='primary'
              style={{ boxShadow: 'none' }}
              onClick={() => setFormOpen(true)}
            >
              + Beacon
            </Button>
          </div>
          <br />
          <br />
          <br />
          <input type='search' placeholder='Search Beacons' />
          <Button type='submit'>Search</Button>
        </div>

        <div>
          <h1>Filter</h1>
          <div>Beacon filter logic here.</div>
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          margin: 'auto',
          padding: '20px 0'
        }}
      >
        <form style={{ display: form ? 'block' : 'none' }}>
          <TextField
            variant='outlined'
            placeholder='name'
            type='text'
            name='name'
            onChange={handleChange}
            value={values.name}
          />
          <TextField
            variant='outlined'
            placeholder='description'
            type='text'
            name='description'
            onChange={handleChange}
            value={values.description}
          />
          <TextField
            variant='outlined'
            placeholder='location'
            type='text'
            name='location'
            onChange={handleChange}
            value={values.location}
          />
          <TextField
            variant='outlined'
            placeholder='date'
            type='text'
            name='date'
            onChange={handleChange}
            value={values.date}
          />
          <TextField
            variant='outlined'
            placeholder='time'
            type='text'
            name='time'
            onChange={handleChange}
            value={values.time}
          />
          <Button onClick={handleSubmit}>Create</Button>
        </form>
        {data.beacons.map(beacon => (
          <div key={beacon.id}>
            <Paper
              style={{
                boxShadow: 'none',
                marginBottom: '15px',
                minWidth: '60vw'
              }}
            >
              <div style={{ borderBottom: '1px solid #ccc', padding: '10px' }}>
                {beacon.name}
              </div>
              <div style={{ borderBottom: '1px solid #ccc', padding: '10px' }}>
                {beacon.description}

                <div>Location: {beacon.location}</div>
                <div>Date: {beacon.date}</div>
                <div>Time: {beacon.time}</div>
              </div>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  padding: '10px'
                }}
              >
                <span style={{ margin: '0 5px' }}>
                  {moment(beacon.createdAt).fromNow()}
                </span>{' '}
                |
                <span style={{ margin: '0 5px' }}>
                  Created by{' '}
                  <Link to={`creative/${beacon.user.alias}/`}>
                    {beacon.user.alias}
                  </Link>
                </span>
              </div>
            </Paper>
          </div>
        ))}
      </div>
    </>
  );
}
