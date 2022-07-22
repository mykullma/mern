import React from 'react';
import { Navigate } from 'react-router-dom';
import { connect } from 'react-redux';

const PrivateRoute = ({
  component: Component,
  auth: { isAuthenticated, loading }
}) => {
  if (isAuthenticated && !loading) return <Component />;

  return <Navigate to="/login" />;
};

const mapStateToProps = (state) => ({
  auth: state.auth
});

export default connect(mapStateToProps)(PrivateRoute);