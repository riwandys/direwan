import React from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import getFollow from "../../actions/profile";

const ProfileItem = ({
  getFollow,
  profile: {
    user: { _id, name, avatar },
    status,
    company,
    location,
    skills,
  },
}) => {
  return (
    <div className="profile bg-light">
      <img className="round-img" src={avatar} />
      <div>
        <h2>{name}</h2>
        <p>{status}</p>
        <p className="my-1">{location && <span>{location}</span>}</p>
        <Link to={`/profile/${_id}`} className="btn btn-primary">
          View Profile
        </Link>
        
      </div>
      <ul>
        {skills.slice(0, 4).map((skill, index) => (
          <li key={index} className="text-primary">
            <i class="material-icons">done</i>
            {skill}
          </li>
        ))}
      </ul>
    </div>
  );
};

ProfileItem.propTypes = {
  profile: PropTypes.object.isRequired,
  getFollow: PropTypes.func.isRequired,
};

export default ProfileItem;
