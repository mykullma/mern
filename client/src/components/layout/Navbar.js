import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { logout } from '../../actions/auth';

const Navbar = ({ logout, auth: { isAuthenticated, loading } }) => {
  const guestLinks = (
    <ul>
      <li><Link to="/profiles">Developers</Link></li>
      <li><Link to="/register">Register</Link></li>
      <li><Link to="/login">Login</Link></li>
    </ul>
  );
  const authLinks = (
    <ul>
      <li><Link to="/dashboard"><i className="fa fa-user"></i> Dashboard</Link></li>
      <li><Link to="/profiles">Developers</Link></li>
      <li><Link to="/posts">Posts</Link></li>
      <li><Link to="/dashboard" onClick={logout}><i className="fa fa-sign-out-alt"></i> Logout</Link></li>
    </ul>
  );
  
  return (
    <nav className="navbar bg-dark">
      <h1>
        <Link to="/"><i className="fa fa-code"></i> Devbook</Link>
      </h1>
      { !loading && ( isAuthenticated ? authLinks : guestLinks ) }
    </nav>
  )
};

const useState = state => ({
  auth: state.auth
});

export default connect(useState, { logout })(Navbar);