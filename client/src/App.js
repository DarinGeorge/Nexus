import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

// Pages
import Home from './pages/home';
import Login from './pages/auth/login';
import Register from './pages/auth/register';
import Feed from './pages/feed';
import Messages from './pages/messages';
import Profile from './pages/profile';
import Beacon from './pages/beacons';

// Components
import Layout from './components/base/layout';
import { AuthProvider } from './utils/context/auth';
import { AuthRoute, ProtectedRoute } from './utils/helpers/routeTypes';
import PostView from './components/Feed/PostView';
import ReactNotifications from 'react-notifications-component';

function App() {
  return (
    <AuthProvider>
      <Router>
        <ReactNotifications />
        <Layout>
          <Route exact path='/' component={Home} />
          <AuthRoute exact path='/auth/login' component={Login} />
          <AuthRoute exact path='/auth/register' component={Register} />
          <ProtectedRoute exact path='/messages' component={Messages} />
          <ProtectedRoute exact path='/messages/:id' component={Messages} />
          <ProtectedRoute exact path='/feed' component={Feed} />
          <ProtectedRoute exact path='/beacons' component={Beacon} />
          <Route path='/feed/:postId' component={PostView} />
          <Route path='/creative/:alias' component={Profile} />
        </Layout>
      </Router>
    </AuthProvider>
  );
}

export default App;
