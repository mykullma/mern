import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { connect } from 'react-redux';
import { setAlert } from '../../actions/alert';
import { register } from '../../actions/auth';

const Register = ({ setAlert, register, isAuthenticated }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password2: ''
  });
  const { name, email, password, password2 } = formData;
  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });
  const onSubmit = async e => {
    e.preventDefault();
    if (password !== password2) {
      setAlert('password do not match', 'danger');
    } else {
      register({ name, email, password });
    }
  };
  if (isAuthenticated) return <Navigate to='/dashboard' />;

  return (
    <section>
      <h1 className="large text-primary">Sign Up</h1>
      <p className="lead"><i className="fas fa-user"></i> Create Your Account</p>
      <form className="form" onSubmit={onSubmit}>
        <div className="form-group">
          <input type="text" placeholder="Name" name="name" onChange={onChange} required />
        </div>
        <div className="form-group">
          <input type="email" placeholder="Email Address" name="email" onChange={onChange} />
          <small className="form-text">This site uses Gravatar so if you want a profile image,
             use a Gravatar email</small>
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
        <div className="form-group">
          <input
            type="password"
            placeholder="Confirm Password"
            name="password2"
            onChange={onChange}
            minLength="6"
          />
        </div>
        <input type="submit" className="btn btn-primary" value="Register" />
      </form>
      <p className="my-1">Already have an account? <Link to="/login">Sign In</Link></p>
    </section>
  )
};

const mapState = state => ({ isAuthenticated: state.auth.isAuthenticated });

export default connect(mapState, { setAlert, register })(Register);