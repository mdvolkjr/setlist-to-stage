// ─────────────────────────────────────────────────────────────────────────────
// FIREBASE CONFIGURATION
// ─────────────────────────────────────────────────────────────────────────────
// HOW TO GET THESE VALUES:
//   1. Go to https://console.firebase.google.com
//   2. Create a new project (or open an existing one)
//   3. Click the </> (web) icon to add a web app
//   4. Copy the firebaseConfig object values below
//   5. In the left sidebar, go to Build → Firestore Database
//   6. Click "Create database" → Start in test mode → pick a region → Done
// ─────────────────────────────────────────────────────────────────────────────

export const firebaseConfig = {
  apiKey:            "YOUR_API_KEY",
  authDomain:        "YOUR_PROJECT_ID.firebaseapp.com",
  projectId:         "YOUR_PROJECT_ID",
  storageBucket:     "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId:             "YOUR_APP_ID"
};
