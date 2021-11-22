import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCnNylpLkRy7nnamwPuvoYLRXA0FIwIyI8",
  authDomain: "issue-tracking-system-c6cc2.firebaseapp.com",
  projectId: "issue-tracking-system-c6cc2",
  storageBucket: "issue-tracking-system-c6cc2.appspot.com",
  messagingSenderId: "174390300129",
  appId: "1:174390300129:web:67115b4b34cbe82c8ad6a0",
  measurementId: "G-VK9CVV2NS6",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
console.log(app.options);
export { auth, db };
