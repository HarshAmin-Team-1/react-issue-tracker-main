import {
  getDoc,
  setDoc,
  deleteDoc,
  serverTimestamp,
  doc,
  arrayUnion,
} from "firebase/firestore";
import { auth, db } from "./firebase";

export async function addIncident(incident) {
  const {
    currentUser: { uid, email, displayName },
  } = auth;
  const id = Date.now().toString();
  const ref = doc(db, `incidents/${id}`);
  const newIncident = {
    ...incident,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    user: {
      uid,
      email,
      displayName,
    },
    id,
  };
  await setDoc(ref, newIncident);
  return newIncident;
}

export function updateIncident(id, incident) {
  const ref = doc(db, `incidents/${id}`);
  return setDoc(ref, incident, { merge: true });
}

export function deleteIncident(id) {
  const ref = doc(db, `incidents/${id}`);
  return deleteDoc(ref);
}

export async function getCategories() {
  const ref = doc(db, `categories/${auth.currentUser.uid}`);
  const data = await getDoc(ref);
  return data.data();
}

export async function addCategory(category) {
  const {
    currentUser: { uid, email, displayName },
  } = auth;
  const ref = doc(db, `categories/${uid}`);
  return setDoc(
    ref,
    {
      id: uid,
      categories: arrayUnion(...[category]),
      user: {
        uid,
        email,
        displayName,
      },
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
}
