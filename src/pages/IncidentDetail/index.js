import { doc, serverTimestamp } from "firebase/firestore";
import moment from "moment";
import { useEffect, useState } from "react";
import { useDocument } from "react-firebase-hooks/firestore";
import { useHistory, useParams } from "react-router-dom";
import { db } from "../../server/firebase";
import { deleteIncident, updateIncident } from "../../server/incidents";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import PrintIcon from "@mui/icons-material/Print";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckIcon from "@mui/icons-material/Check";
import { Link } from "react-router-dom";
import Tooltip from "@mui/material/Tooltip";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";

const IncidentDetails = () => {
  const { id } = useParams();
  const [incident, setIncident] = useState({});
  const [deleting, setDeleting] = useState(false);
  const [resolving, setResolving] = useState(false);

  const history = useHistory();
  const [incidentDoc, loading, error] = useDocument(
    doc(db, `incidents/${id}`),
    {}
  );
  useEffect(() => {
    if (incidentDoc?.exists()) {
      setIncident(incidentDoc.data());
    }
  }, [incidentDoc]);

  async function handleDelete() {
    setDeleting(true);
    await deleteIncident(id);
    history.push("/");
  }

  async function markAsResolved() {
    setResolving(true);
    await updateIncident(id, {
      resolved: true,
      dateResolved: serverTimestamp(),
    });
    setResolving(false);
  }

  return (
    <div className="blog-details">
      {loading && <div>Loading...</div>}
      {error && <div>{error}</div>}
      {incident && (
        <article>
          <div className="IconContainer">
            <Tooltip
              style={{ marginRight: "26rem" }}
              title="Back"
              onClick={() => history.goBack()}
            >
              <Link to="#">
                <ArrowBackIosIcon />
              </Link>
            </Tooltip>

            <Tooltip title="Edit" onClick={() => history.push(`/edit/${id}`)}>
              <Link to="#">
                <EditOutlinedIcon style={{ marginRight: 15 }} />
              </Link>
            </Tooltip>
            <Tooltip title="Print">
              <Link style={{ marginRight: 15 }} onClick={() => window.print()}>
                <PrintIcon />
              </Link>
            </Tooltip>
            <Tooltip title="Delete">
              <Link
                style={{ marginRight: 15, opacity: deleting ? 0.5 : 1 }}
                onClick={handleDelete}
              >
                <DeleteIcon />
              </Link>
            </Tooltip>
            <Tooltip
              title={incident.resolved ? "Resolved" : "Mark as resolved"}
            >
              <Link
                style={{
                  marginRight: 15,
                  opacity: resolving || incident.resolved ? 0.5 : 1,
                }}
                onClick={!incident.resolved && markAsResolved}
                to="#"
              >
                <CheckIcon />
              </Link>
            </Tooltip>
          </div>
          <div style={{ marginTop: "3em" }}>
            <h2>{incident?.category?.title}</h2>

            <p>
              {moment(incident?.createdAt?._seconds).format("ddd, MMM DD YYYY")}
            </p>
            <p>
              {incident?.resolved &&
                `Resolved on ${moment(incident?.dateResolved?._seconds).format(
                  "ddd MM DD, YYYY"
                )}`}
            </p>
            <b>Assigned To: {incident?.currentAssignee}</b>
            <p>Tags: {incident?.tags?.join(", ")}</p>
            <div>{incident?.description}</div>
          </div>
        </article>
      )}
    </div>
  );
};

export default IncidentDetails;
