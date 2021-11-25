import { useEffect, useState } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import AppInput from "../../components/AppInput";
import { useDocument } from "react-firebase-hooks/firestore";
import { arrayUnion, doc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../../server/firebase";
import { addCategory, updateIncident } from "../../server/incidents";
import { ArrowBackIosNew, Assignment } from "@mui/icons-material";
import { getUserDocs } from "../../server/authentication";
const EditIncident = () => {
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [state, setState] = useState("");
  const [tags, setTags] = useState([]);
  const [currentAssignee, setCurrentAssignee] = useState("");
  const [updating, setUpdating] = useState(false);
  const [users, setUsers] = useState([]);
  const user = auth.currentUser;
  const { id } = useParams();

  const history = useHistory();

  const handleSubmit = async (e) => {
    setUpdating(true);
    e.preventDefault();
    const assigneeUpdated = users.find(
      (user) => user.uid === currentAssignee
    ) || {
      uid: user.uid,
      displayName: user.displayName,
      photoURL: user.photoURL,
      email: user.email,
    };
    await updateIncident(id, {
      category,
      description,
      state,
      tags: tags.split(","),
      currentAssignee: assigneeUpdated,
      caseHistory: arrayUnion({
        user: {
          uid: user.uid,
          displayName: user.displayName,
          email: user.email,
        },
        date: new Date(),
        action: "Updated",
        description: `${user.displayName} assigned to ${assigneeUpdated.displayName} and updated the issue.`,
      }),
    });
    history.push("/incidents/" + id);
  };

  const [categoryDoc, loading, error] = useDocument(
    doc(db, `categories/${auth.currentUser.uid}`),
    {}
  );
  const [incidentDoc, incidentLoading, incidentError] = useDocument(
    doc(db, `incidents/${id}`),
    {}
  );
  useEffect(() => {
    if (incidentDoc?.exists()) {
      const incident = incidentDoc.data();
      setCategory(incident.category);
      setDescription(incident.description);
      setState(incident.state);
      setTags(incident.tags.join(","));
      setCurrentAssignee(incident.currentAssignee);
    }
  }, [incidentDoc]);

  useEffect(() => {
    console.log(categoryDoc, error);
  }, [categoryDoc, loading, error]);

  useEffect(() => {
    const fetchUsers = async () => {
      setUsers((await getUserDocs()).docs.map((doc) => doc.data()));
    };
    fetchUsers();
  }, []);

  return (
    <div className="create">
      {loading || incidentLoading ? (
        <div>Loading...</div>
      ) : incidentDoc?.exists() ? (
        <>
          <div className="BackIcon">
            <Link to="#" onClick={history.goBack}>
              <ArrowBackIosNew />
            </Link>
          </div>

          <h2>Editing Issue</h2>
          <form onSubmit={handleSubmit}>
            <AppInput
              value={category}
              setValue={setCategory}
              createFilterOptions={addCategory}
              options={categoryDoc?.data()?.categories || []}
            />
            <label>Description</label>
            <textarea
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
            ></textarea>
            <label>Tags</label>
            <input
              type="text"
              required
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
            <label>Current Assignee</label>
            <select
              name="Assignee"
              id="Assignee"
              style={{ width: "106%", color: "#f1356d" }}
              onChange={(e) => {
                setCurrentAssignee(e.target.value);
                console.log(e.target.value);
              }}
            >
              {users.map((user) => (
                <option
                  key={user.uid}
                  value={user.uid}
                  label={user.displayName}
                >
                  {user.displayName}
                </option>
              ))}
            </select>

            <button
              disabled={updating ? true : false}
              style={{ opacity: updating ? 0.5 : 1 }}
            >
              {updating ? "Updating..." : "Update Incident"}
            </button>
          </form>
        </>
      ) : (
        <div>Incident not found ...</div>
      )}
    </div>
  );
};

export default EditIncident;
