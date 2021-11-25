import { Link } from "react-router-dom";
import CheckIcon from "@mui/icons-material/Check";
import moment from "moment";
const Incidents = ({ incidents = [] }) => {
  return (
    <div className="blog-list">
      {incidents.map((incident) => (
        <div className="blog-preview" key={incident.id}>
          <Link to={`/incidents/${incident.id}`}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <h2>{incident?.category?.title}</h2>
              <p>#{incident.id}</p>
            </div>
            <p>
              {moment(incident?.createdAt._seconds).format("ddd, MMM DD YYYY")}
            </p>
            <p>Created by {incident.user.displayName}</p>
            <p>Assigned to {incident.currentAssignee?.displayName || "You"}</p>
            {incident?.resolved && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginTop: "1em",
                  flexDirection: "row",
                }}
              >
                <CheckIcon />
                <p style={{ marginLeft: "1em" }}>
                  {moment(incident?.dateResolved?._seconds).format(
                    "ddd DD MMM, YYYY"
                  )}
                </p>
              </div>
            )}
          </Link>
        </div>
      ))}
    </div>
  );
};

export default Incidents;
