import { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import AppInput from "../../components/AppInput";
import { useDocument } from "react-firebase-hooks/firestore";
import { doc } from "firebase/firestore";
import { auth, db } from "../../server/firebase";
import { addCategory, addIncident } from "../../server/incidents";
import { ArrowBackIosNew } from "@mui/icons-material";
import { getUserDocs } from "../../server/authentication";
const CreateIncident = () => {
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [state, setState] = useState("Work in progress.");
  const [tags, setTags] = useState([]);
  const [currentAssignee, setCurrentAssignee] = useState({});
  const [creating, setCreating] = useState(false);
  const [users, setUsers] = useState([]);
  const history = useHistory();
  const { currentUser } = auth;
  const handleSubmit = async (e) => {
    setCreating(true);
    e.preventDefault();
    await addIncident({
      category,
      description,
      state,
      tags: tags.split(","),
      currentAssignee: users.find((user) => user.uid === currentAssignee) || {
        uid: currentUser.uid,
        email: currentUser.email,
        displayName: currentUser.displayName,
        photoURL: currentUser.photoURL,
      },
      caseHistory: [
        {
          action: "Created",
          user: {
            uid: currentUser.uid,
            email: currentUser.email,
            displayName: currentUser.displayName,
            photoURL: currentUser.photoURL,
          },
          date: new Date(),
          description: `${currentUser.displayName} created the issue.`,
        },
      ],
    });
    console.log(
      {
        category,
        description,
        state,
        tags: tags.split(","),
        currentAssignee: users.find((user) => user.uid === currentAssignee),
      },
      currentAssignee
    );
    history.push("/");
  };

  const [categoryDoc, loading, error] = useDocument(
    doc(db, `categories/${auth.currentUser.uid}`),
    {}
  );

  useEffect(() => {
    const fetchUsers = async () => {
      setUsers((await getUserDocs()).docs.map((doc) => doc.data()));
    };
    fetchUsers();
  }, []);

  return (
    <div className="create">
      <div className="BackIcon">
        <Link to="#" onClick={history.goBack}>
          <ArrowBackIosNew />
        </Link>
      </div>
      <h2>Create a New Issue</h2>
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
          <option disabled selected>
            Select Assignee
          </option>
          {users.map((user) => (
            <option key={user.uid} value={user.uid} label={user.displayName}>
              {user.displayName}
            </option>
          ))}
        </select>

        <button style={{ opacity: creating ? 0.5 : 1 }}>
          {creating ? "Creating..." : "Create Incident"}
        </button>
      </form>
    </div>
  );
};

export default CreateIncident;
