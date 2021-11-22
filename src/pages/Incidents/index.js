import { Link } from "react-router-dom";
import moment from "moment";
const Incidents = ({ incidents = [] }) => {
  return (
    <div className="blog-list">
      {incidents.map((incident) => (
        <div className="blog-preview" key={incident.id}>
          <Link to={`/incidents/${incident.id}`}>
            <h2>{incident.category.title}</h2>
            <p>
              {moment(incident?.createdAt._seconds).format("ddd, MMM DD YYYY")}
            </p>
            <p>Written by {incident.user.displayName}</p>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default Incidents;
