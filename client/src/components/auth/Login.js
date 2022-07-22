import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { connect } from 'react-redux';
import { login } from '../../actions/auth';

const Login = ({ login, isAuthenticated }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const { email, password } = formData;
  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });
  const onSubmit = async e => {
    e.preventDefault();
    login(email, password);
  };
  if (isAuthenticated) return <Navigate to='/dashboard' />;

  return (
    <section>
      <h1 className="large text-primary">Sign In</h1>
      <p className="lead"><i className="fas fa-user"></i> Sign Into Your Account</p>
      <form className="form" onSubmit={onSubmit}>
        <div className="form-group">
          <input type="email" placeholder="Email Address" name="email" onChange={onChange} />
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Password"
            name="password"
            onChange={onChange}
            minLength="6"
          />
        </div>
        <input type="submit" className="btn btn-primary" value="Login" />
      </form>
      <p className="my-1">Don't have an account? <Link to="/register">Sign Up</Link></p>
    </section>
  )
};

const mapState = state => ({ isAuthenticated: state.auth.isAuthenticated });

export default connect(mapState, { login })(Login);