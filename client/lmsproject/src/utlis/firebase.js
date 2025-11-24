// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "loginnocap.firebaseapp.com",
  projectId: "loginnocap",
  storageBucket: "loginnocap.firebasestorage.app",
  messagingSenderId: "14877146509",
  appId: "1:14877146509:web:974fc3c86956068b21d1c4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const provider = new GoogleAuthProvider();
// Add the client ID to the provider
provider.setCustomParameters({
  client_id: import.meta.env.VITE_FIREBASE_CLIENT_ID
});

export { auth, provider };
