import React from 'react';
import { connect } from 'react-redux';
import { follow, unfollow } from '../../actions/auth';

const ProfileTop = ({
  profile: {
    status,
    company,
    location,
    website,
    social,
    user: { name, avatar, _id }
  },
  auth,
  follow,
  unfollow,
  isAuthenticated
}) => {
  return (
    <div className="profile-top bg-primary p-2">
      <img className="round-img my-1" src={avatar} alt="" />
      <h1 className="large">{name}{' '}{isAuthenticated && (
      auth.user.follows.filter((follow) => follow.user === _id).length > 0 ? (
        <button className="follow" onClick={() => unfollow(_id)}>
          <i className="fas fa-user-minus" />
        </button>
      ) : (
        <button className="follow" onClick={() => follow(_id)}>
          <i className="fas fa-user-plus" />
        </button>
      ))}
      </h1>
      <p className="lead">
        {status} {company ? <span> at {company}</span> : null}
      </p>
      <p>{location ? <span>{location}</span> : null}</p>
      <div className="icons my-1">
        {website ? (
          <a href={website} target="_blank" rel="noopener noreferrer">
            <i className="fas fa-globe fa-2x" />
          </a>
        ) : null}
        {social
          ? Object.entries(social)
              .filter(([_, value]) => value)
              .map(([key, value]) => (
                <a
                  key={key}
                  href={value}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className={`fab fa-${key} fa-2x`}></i>
                </a>
              ))
          : null}
      </div>
    </div>
  );
};

const mapState = state => ({
  auth: state.auth,
  isAuthenticated: state.auth.isAuthenticated
})

export default connect(mapState, { follow, unfollow })(ProfileTop);