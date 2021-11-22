import { TextField } from "@mui/material";
import { query, where, orderBy, collection } from "firebase/firestore";
import { useState } from "react";
import { useCollection } from "react-firebase-hooks/firestore";
import { auth, db } from "../../server/firebase";
import Incidents from "../Incidents";

const Home = () => {
  const user = auth.currentUser;
  const [searchText, setSearchText] = useState(null);
  const q = query(
    collection(db, "incidents"),
    where("user.uid", "==", user.uid),
    searchText
      ? where("category.title", "==", searchText)
      : orderBy("updatedAt", "desc")
  );
  const [incidentDocs, loading, error] = useCollection(q, {
    snapshotListenOptions: { includeMetadataChanges: true },
  });
  return (
    <div className="home">
      <TextField
        size="small"
        onChange={(e) => setSearchText(e.target.value)}
        variant="standard"
        label="Search "
        style={{ width: "100%" }}
        placeholder="Search by category"
      ></TextField>
      {error && <div>{error}</div>}
      {loading && <div style={{ marginTop: 10 }}>Loading...</div>}
      {incidentDocs?.empty && (
        <div style={{ marginTop: 10 }}>No Incidents yet...</div>
      )}
      {!incidentDocs?.empty && (
        <Incidents incidents={incidentDocs?.docs?.map((doc) => doc.data())} />
      )}
    </div>
  );
};

export default Home;
