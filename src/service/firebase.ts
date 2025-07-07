import { initializeApp } from "firebase/app";
import { getFirestore,  collection,
  addDoc,
  serverTimestamp,
  doc,
  setDoc, getDoc , onSnapshot, updateDoc, arrayUnion,} from 'firebase/firestore';

  import { getAuth, signInAnonymously } from 'firebase/auth';


const firebaseConfig = {
  apiKey: "AIzaSyDaxrDMbmvghYz3XhdaDApXiPqGz68VXJU",
  authDomain: "would-you-rather-6d291.firebaseapp.com",
  projectId: "would-you-rather-6d291",
  storageBucket: "would-you-rather-6d291.firebasestorage.app",
  messagingSenderId: "680531994013",
  appId: "1:680531994013:web:7fbc1e56e65228fb86bb74"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
 const db = getFirestore(app);
  const auth = getAuth();

export {
  db,  collection,
  addDoc,
  serverTimestamp,
  doc,
  setDoc, getDoc, onSnapshot, updateDoc, arrayUnion, auth, signInAnonymously
}