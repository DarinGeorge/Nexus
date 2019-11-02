import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

// Pages
import Home from './pages/home';
import Login from './pages/auth/login';
import Register from './pages/auth/register';
import Feed from './pages/feed';

// Components
import Layout from './components/base/layout';
import { AuthProvider } from './utils/context/auth';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Route exact path='/' component={Home} />
          <Route exact path='/auth/login' component={Login} />
          <Route exact path='/auth/register' component={Register} />
          <Route exact path='/feed' component={Feed} />
        </Layout>
      </Router>
    </AuthProvider>
  );
}

export default App;
