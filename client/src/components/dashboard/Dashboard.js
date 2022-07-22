import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { getCurrentProfile, deleteAccount } from '../../actions/profile';
import DashboardActions from './DashboardActions';
import Experience from './Experience';

const Dashboard = ({ auth: { user }, profile, getCurrentProfile, deleteAccount }) => {
  useEffect(() => {
    getCurrentProfile();
  }, [getCurrentProfile]);
  
  return (
    <>
      <h1 className="large text-primary">Dashboard</h1>
      <p className="lead">
        <i className="fas fa-user" /> Welcome {user && user.name}
      </p>
      {profile.profile !== null ? (
        <>
          <DashboardActions />
          <Experience experience={profile.profile.experience} />
          <div className="my-2">
            <button className="btn btn-danger" onClick={() => deleteAccount()}>
              <i className="fas fa-user-minus" /> Delete My Account
            </button>
          </div>
        </>
      ) : (
        <>
          <p>You have not yet setup a profile, please add some info</p>
          <Link to="/create-profile" className="btn btn-primary my-1">Create Profile</Link>
        </>
      )}
    </>
  );
};

const mapState = state => ({
  auth: state.auth,
  profile: state.profile
});

export default connect(mapState, { getCurrentProfile, deleteAccount })(Dashboard);