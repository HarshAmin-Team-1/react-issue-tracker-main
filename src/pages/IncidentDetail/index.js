import { arrayUnion, doc, serverTimestamp } from "firebase/firestore";
import moment from "moment";
import { useEffect, useState } from "react";
import { useDocument } from "react-firebase-hooks/firestore";
import { useHistory, useParams } from "react-router-dom";
import { auth, db } from "../../server/firebase";
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
  const user = auth.currentUser;
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
      caseHistory: arrayUnion({
        date: new Date(),
        description: `${user.displayName} resolved the issue.`,
        user: {
          uid: user.uid,
          displayName: user.displayName,
          photoURL: user.photoURL,
          email: user.email,
        },
        action: "resolved",
      }),
    });
    setResolving(false);
  }

  return (
    <div className="blog-details">
      {loading && <div>Loading...</div>}
      {error && <div>{error}</div>}
      {incident && !loading && (
        <article>
          <div className="IconContainer">
            <Tooltip
              style={{ marginRight: "26rem" }}
              title="Back"
              onClick={() => history.push("/")}
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

            <p style={{ marginTop: "1em", marginBottom: 10 }}>
              {moment(
                incident?.createdAt?.seconds
                  ? incident?.createdAt?.seconds * 1000
                  : incident?.createdAt?._seconds
              ).format("ddd, MMM DD YYYY")}
            </p>

            <h4>
              Assigned To: {incident?.currentAssignee?.displayName || "You"}
            </h4>
            <h4 style={{ marginTop: 10 }}>
              Tags: {incident?.tags?.join(", ")}
            </h4>
            <div>{incident?.description}</div>
            <div>
              <h3>Case History</h3>
              <ul>
                {incident?.caseHistory
                  ?.sort((a, b) => b.date?._seconds - a.date?._seconds)
                  .map((history) => (
                    <li key={history.date}>
                      <div
                        style={{
                          flex: 1,
                          flexDirection: "row",
                        }}
                      >
                        <p>
                          <b>
                            {moment(
                              history.date?.seconds
                                ? history.date?.seconds * 1000
                                : history.date?._seconds
                            ).format("ddd, HH:MM, DD MMM")}
                          </b>{" "}
                          :- {history.description}
                        </p>
                      </div>
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        </article>
      )}
    </div>
  );
};

export default IncidentDetails;
