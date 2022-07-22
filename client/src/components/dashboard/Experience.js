import React from 'react';
import { connect } from 'react-redux';
import { deleteExperience } from '../../actions/profile';
import Moment from 'react-moment';

const Experience = ({ experience, deleteExperience }) => {
  const experiences = experience.map((exp) => (
    <tr key={exp._id}>
      <td>{exp.company}</td>
      <td className="hide-sm">{exp.title}</td>
      <td>
        <Moment format='YYYY/MM/DD'>{exp.from}</Moment> - {
          exp.to ? <Moment format='YYYY/MM/DD'>{exp.to}</Moment> : 'Now'
        }
      </td>
      <td>
        <button
          onClick={() => deleteExperience(exp._id)}
          className="btn btn-danger"
        > Delete
        </button>
      </td>
    </tr>
  ));

  return (
    <>
      <h2 className="my-2">Experiences</h2>
      <table className="table">
        <thead>
          <tr>
            <th>Company</th>
            <th className="hide-sm">Title</th>
            <th className="hide-sm">Years</th>
            <th />
          </tr>
        </thead>
        <tbody>{experiences}</tbody>
      </table>
    </>
  );
};

export default connect(null, { deleteExperience })(Experience);