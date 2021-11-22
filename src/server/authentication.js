import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { auth } from "./firebase";

export function createUser(email, password, displayName) {
  createUserWithEmailAndPassword(auth, email, password).then((user) => {
    updateProfile(user.user, { displayName });
  });
}

export function signinUser(email, password) {
  return signInWithEmailAndPassword(auth, email, password);
}
