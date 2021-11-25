import { Autocomplete, TextField } from "@mui/material";
import { query, where, orderBy, collection, doc } from "firebase/firestore";
import moment from "moment";
import { useEffect, useState } from "react";
import { useCollection, useDocument } from "react-firebase-hooks/firestore";
import { auth, db } from "../../server/firebase";
import Incidents from "../Incidents";

const Home = () => {
  const user = auth.currentUser;
  const [searchText, setSearchText] = useState(null);
  const [categories, setCategories] = useState([]);
  const q = query(
    collection(db, "incidents"),
    where("user.uid", "==", user.uid),
    searchText
      ? where("category.title", "==", searchText)
      : orderBy("updatedAt", "desc")
  );

  const q1 = query(
    collection(db, "incidents"),
    where("currentAssignee.uid", "==", user.uid),
    searchText
      ? where("category.title", "==", searchText)
      : orderBy("updatedAt", "desc")
  );

  const [incidentDocs, loading, error] = useCollection(q, {
    snapshotListenOptions: { includeMetadataChanges: true },
  });
  const [currentAssigneeDocs, assigneLoading, assigneError] = useCollection(
    q1,
    {
      snapshotListenOptions: { includeMetadataChanges: true },
    }
  );

  useEffect(() => {
    console.log(currentAssigneeDocs?.size, assigneError);
  }, [currentAssigneeDocs, assigneError]);

  const [categoryDoc, categoryLoading, categoryError] = useDocument(
    doc(db, `categories/${auth.currentUser.uid}`),
    {}
  );
  useEffect(() => {
    if (categoryDoc?.exists()) {
      setCategories(categoryDoc.data().categories);
    }
  }, [categoryDoc]);
  return (
    <div className="home">
      {error && <div>{error}</div>}
      <Autocomplete
        disablePortal
        id="combo-box-demo"
        options={categories.map((category) => category.title) || []}
        sx={{ width: "100%" }}
        onChange={(e, newValue) => {
          setSearchText(newValue);
          console.log(searchText);
        }}
        renderInput={(params) => (
          <TextField {...params} label="Search" variant="standard" />
        )}
      />

      {loading && <div style={{ marginTop: 30 }}>Loading...</div>}
      {incidentDocs?.empty && (
        <div style={{ marginTop: "2em" }}>No Issues created by you yet...</div>
      )}
      {!incidentDocs?.empty && (
        <Incidents
          incidents={[
            ...(incidentDocs?.docs?.map((doc) => doc.data()) || []),
            ...(currentAssigneeDocs?.docs
              ?.map((doc) => doc.data())
              .filter((data) => data.user.uid !== user.uid) || []),
          ].sort((a, b) => b.id - a.id)}
        />
      )}
    </div>
  );
};

export default Home;
