import { getAuth } from "firebase/auth";
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyDdHihi5WKzXXffbRFrVyTc9Og6RQvqczo",
  authDomain: "anbu-suvai.firebaseapp.com",
  projectId: "anbu-suvai",
  storageBucket: "anbu-suvai.appspot.com",
  messagingSenderId: "1092363447924",
  appId: "1:1092363447924:web:e22510954fd3a25021ab21",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
