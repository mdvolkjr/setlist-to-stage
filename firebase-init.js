// ── Firebase initialization (shared by index.html and song.html) ──
// Uses the Firebase v10 modular SDK straight from the CDN, so there is no
// build step — the app stays "open a file / deploy static files" simple.
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";

// Public web config — safe to embed in client code (these are not secrets;
// access is controlled by Firestore/Storage security rules, not by hiding this).
const firebaseConfig = {
  apiKey: "AIzaSyCWd-icsacKEHD-NWkQ7s8wX89FNEINMYc",
  authDomain: "setlist-to-stage.firebaseapp.com",
  projectId: "setlist-to-stage",
  storageBucket: "setlist-to-stage.firebasestorage.app",
  messagingSenderId: "61297249214",
  appId: "1:61297249214:web:3fb3cb3f2d5979c98cc7ef",
  measurementId: "G-J9DYLHEHT7"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();
