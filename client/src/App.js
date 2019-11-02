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
import { AuthRoute, ProtectedRoute } from './utils/helpers/routeTypes';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Route exact path='/' component={Home} />
          <AuthRoute exact path='/auth/login' component={Login} />
          <AuthRoute exact path='/auth/register' component={Register} />
          <ProtectedRoute exact path='/feed' component={Feed} />
        </Layout>
      </Router>
    </AuthProvider>
  );
}

export default App;
