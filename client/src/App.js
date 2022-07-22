import './App.css';
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux';
import { loadUser } from './actions/auth';
import store from './store';
import Landing from './components/layout/Landing';
import Navbar from './components/layout/Navbar';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Alert from './components/layout/Alert';
import setAuthToken from './utils/setAuthToken';
import PrivateRoute from './components/routing/PrivateRoute';
import Dashboard from './components/dashboard/Dashboard';
import CreateProfile from './components/profile-form/CreateProfile';
import AddExperience from './components/profile-form/AddExperience';
import Profiles from './components/profiles/Profiles';
import Profile from './components/profile/Profile';
import Posts from './components/posts/Posts';
import Post from './components/post/Post';

if (localStorage.token) setAuthToken(localStorage.token);

function App() {
  useEffect(() => {
    store.dispatch(loadUser());
  });

  return (
    <Provider store={store}>
      <Router>
        <Navbar />
        <div className='container'>
          <Alert />
          <Routes>
            <Route path='/' element={<Landing />} />
            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Register />} />
            <Route path='/profiles' element={<Profiles />} />
            <Route path="/profile/:id" element={<Profile />} />
            <Route path='/dashboard' element={<PrivateRoute component={Dashboard} />} />
            <Route path='/create-profile' element={<PrivateRoute component={CreateProfile} />} />
            <Route path='/edit-profile' element={<PrivateRoute component={CreateProfile} />} />
            <Route path='/add-experience' element={<PrivateRoute component={AddExperience} />} />
            <Route path='/posts' element={<PrivateRoute component={Posts} />} />
            <Route path='/posts/:id' element={<PrivateRoute component={Post} />} />
          </Routes>
        </div>
      </Router>
    </Provider>
  );
}

export default App;
