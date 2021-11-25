import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  query,
  setDoc,
} from "firebase/firestore";
import { auth, db } from "./firebase";

export async function createUser(email, password, displayName) {
  return createUserWithEmailAndPassword(auth, email, password)
    .then(async ({ user }) => {
      await updateProfile(user, { displayName, photoURL: null });
      await addUserDoc({
        email,
        displayName,
        uid: user.uid,
        photoURL: user.photoURL,
      });
    })
    .catch((error) => new Error(error));
}

export function signinUser(email, password) {
  return signInWithEmailAndPassword(auth, email, password);
}

export function addUserDoc({ uid, email, displayName, photoURL }) {
  const ref = doc(db, `users/${uid}`);
  return setDoc(ref, { uid, email, displayName, photoURL });
}

export function getUserDocs() {
  const ref = query(collection(db, "users"));
  return getDocs(ref);
}