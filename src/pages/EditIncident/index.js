import { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import AppInput from "../../components/AppInput";
import { useDocument } from "react-firebase-hooks/firestore";
import { doc } from "firebase/firestore";
import { auth, db } from "../../server/firebase";
import { addCategory, updateIncident } from "../../server/incidents";
const EditIncident = () => {
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [dateResolved, setDateResolved] = useState("");
  const [state, setState] = useState("");
  const [tags, setTags] = useState([]);
  const [currentAssignee, setCurrentAssignee] = useState("");
  const [caseHistory, setCaseHistory] = useState();
  const [updating, setUpdating] = useState(false);
  const { id } = useParams();

  const history = useHistory();

  const handleSubmit = async (e) => {
    setUpdating(true);
    e.preventDefault();
    await updateIncident(id, {
      category,
      description,
      dateResolved,
      state,
      tags: tags.split(","),
      currentAssignee,
      caseHistory,
    });
    history.goBack();
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
      setDateResolved(incident.dateResolved);
      setState(incident.state);
      setTags(incident.tags.join(","));
      setCurrentAssignee(incident.currentAssignee);
      setCaseHistory(incident.caseHistory);
    }
  }, [incidentDoc]);

  useEffect(() => {
    console.log(categoryDoc, error);
  }, [categoryDoc, loading, error]);

  return (
    <div className="create">
      {loading ? (
        <div>Loading...</div>
      ) : incidentDoc?.exists() ? (
        <>
          <h2>Editing Incident</h2>
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
            <input
              type="text"
              required
              value={currentAssignee}
              onChange={(e) => setCurrentAssignee(e.target.value)}
            />
            <label>Case history </label>
            <input
              type="text"
              required
              value={caseHistory}
              onChange={(e) => setCaseHistory(e.target.value)}
            />
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
