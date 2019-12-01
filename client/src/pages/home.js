import React, { useContext } from 'react';
import { Button } from '@material-ui/core';
import { AuthContext } from '../utils/context/auth';

function Home({ history }) {
  const { user } = useContext(AuthContext)
  const redirect = () => {
    history.push('/auth/login')
  }

  let Component;
  if (!user) {
    Component = (<div style={{ textAlign: 'center', width: '450px', margin: 'auto auto' }}>
      <h1>Restricted: Access Required</h1>
      <div>This is a developmental beta. Access is only allowed to members granted clearance.</div>
      <p>If you have clearance, please enter your credentials via the login portal.</p>
      <Button variant='contained' color='primary' onClick={redirect}>ENTER ACCESS CREDENTIALS</Button>
    </div>)
  } else {
    Component = <div>Home Page</div>;
  }
  return Component;
}

export default Home;
