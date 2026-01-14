import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
const firebaseConfig = {
  apiKey: "AIzaSyDdHihi5WKzXXffbRFrVyTc9Og6RQvqczo",
  authDomain: "anbu-suvai.firebaseapp.com",
  projectId: "anbu-suvai",
  storageBucket: "anbu-suvai.appspot.com",
  messagingSenderId: "1092363447924",
  appId: "1:1092363447924:web:e22510954fd3a25021ab21"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);     
export const storage = getStorage(app);
