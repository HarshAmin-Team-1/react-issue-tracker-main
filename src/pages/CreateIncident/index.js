import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import AppInput from "../../components/AppInput";
import { useDocument } from "react-firebase-hooks/firestore";
import { doc } from "firebase/firestore";
import { auth, db } from "../../server/firebase";
import { addCategory, addIncident } from "../../server/incidents";
const CreateIncident = () => {
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [dateResolved, setDateResolved] = useState("");
  const [state, setState] = useState("");
  const [tags, setTags] = useState([]);
  const [currentAssignee, setCurrentAssignee] = useState("");
  const [caseHistory, setCaseHistory] = useState();
  const [creating, setCreating] = useState(false);
  const history = useHistory();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addIncident({
      category,
      description,
      dateResolved,
      state,
      tags: tags.split(","),
      currentAssignee,
      caseHistory,
    });
    history.push("/");
  };

  const [categoryDoc, loading, error] = useDocument(
    doc(db, `categories/${auth.currentUser.uid}`),
    {}
  );

  useEffect(() => {
    console.log(categoryDoc, error);
  }, [categoryDoc, loading, error]);

  return (
    <div className="create">
      <h2>Create a New Incident</h2>
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
        <button style={{ opacity: creating ? 0.5 : 1 }}>
          {creating ? "Creating..." : "Create Incident"}
        </button>
      </form>
    </div>
  );
};

export default CreateIncident;
