import './App.css';
import React, { Fragment, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Switch } from 'react-router-dom';
import { Landing } from './components/layout/Landing';
import { Provider } from 'react-redux';
import { loadUser } from './actions/auth';
import store from './store';
import Navbar from './components/layout/Navbar';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Alert from './components/layout/Alert';
import setAuthToken from './utils/setAuthToken';
import PrivateRoute from './components/routing/PrivateRoute';
import Dashboard from './components/dashboard/Dashboard';

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
            <Route path='login' element={<Login />} />
            <Route path='register' element={<Register />} />
            <Route path="dashboard" element={<PrivateRoute component={Dashboard} />} />
          </Routes>
        </div>
      </Router>
    </Provider>
  );
}

export default App;
